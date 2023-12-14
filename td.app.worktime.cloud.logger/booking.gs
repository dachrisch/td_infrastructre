function bookLast30days() {
  let numLastDays = 30
  let now = moment()
  let then = now.clone().subtract(numLastDays, 'days')
  let googleCalendar = new cWrap.CalendarAppWrapper()

  bookWorklogs(then, now, googleCalendar.all())
}

class ErrorCollector {
  constructor() {
    this.errors = {}
  }
  collect(event, error) {
    log.warning(`Registering error for [${event}]: ${error}`)
    this.errors[event] = error
  }

  raiseOnError() {
    if (this.errors) {
      throw new Error(`The following events had errors: ${JSON.stringify(this.errors)}`)
    }
  }
}

/**
 * @param {moment} then
 * @param {moment} then
 * @param {Array.<CalendarInstanceWrapper>} calendars
 * @typedef {{startMoment:moment,endMoment:moment,title:string,bookingInfo:BookingInfo,eventId:string}} EventWrapper
 * @param {function(EventWrapper):void} [eventFilter=anyEventsFilter]
 */
function bookWorklogs(then, now, calendars, eventFilter = anyEventsFilter) {
  const username = Session.getActiveUser().getEmail()
  const jiraApi = api.createBasic(scriptProperty('jiraEndpoint'), username, scriptProperty('jiraToken'))
  const tempoApi = api.createBearer(scriptProperty('tempoEndpoint'), scriptProperty('tempoToken'))

  let issuesService = new jira.JiraIssueService(jiraApi)
  let worklogsSearchService = new jira.TempoWorklogSearchService(tempoApi, jiraApi)
  let worklogsBookService = new jira.TempoWorklogBookService(tempoApi, jiraApi)

  let collector = new ErrorCollector()
  let telemetry = t.Telemetry.forSeries('book_worklogs')
  telemetry.start()

  calendars.forEach((calendar) => {
    log.info(`checking ${calendar} from [${then}] to [${now}] using filter [${eventFilter}]`)
    let calendarEvents = calendar.getEvents(then, now).filter(eventFilter)
    log.fine(`${calendarEvents.length} events in calendar ${calendar}`)
    let withBookingInfo = calendarEvents.filter(entity.EventWrapper.withBookingInfo)
    log.fine(`Events with Booking info ${withBookingInfo.length}`)
    withBookingInfo.forEach((e) => log.finest(e))
    let withValidKeys = withBookingInfo.filter((event) => issuesService.hasValidKey(event))
    log.fine(`Events with valid keys ${withValidKeys.length}`)
    withValidKeys.forEach((e) => log.finest(e))
    let bookable = withValidKeys.filter((event) => worklogsSearchService.hasNoBooking(event))
    log.info(`${bookable.length} Events without existing bookings`)
    bookable.forEach((e) => log.info(e))
    telemetry.count(bookable.length, `${calendar.name}: ${bookable.length}`)
    bookable.forEach((event) => {
      try {
        worklogsBookService.book(event)
      } catch (e) {
        if (e.name == 'Error') {
          collector.collect(event, e)
        } else {
          throw e
        }
      }
    })
  })
  collector.raiseOnError()
  telemetry.end()
}
