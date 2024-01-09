function updateWorktime() {
  deleteFutureAct()
  bookFutureActThisMonth()
  bookLast30days()
}

function deleteFutureAct() {
  const now = moment().subtract(1, 'day').startOf('day')
  const then = now.clone().endOf('month')

  const username = Session.getActiveUser().getEmail()
  const jiraApi = api.createBasic(scriptProperty('jiraEndpoint'), username, scriptProperty('jiraToken'))
  const tempoApi = api.createBearer(scriptProperty('tempoEndpoint'), scriptProperty('tempoToken'))

  const worklogsSearchService = new jira.TempoWorklogSearchService(tempoApi, jiraApi)
  const worklogsDeleteService = new jira.TempoWorklogDeleteService(tempoApi, jiraApi)

  log.info(`deleting act bookings from [${now}] to [${then}]`)
  worklogsSearchService.bookingsInTimerange(now, then).filter(actBookingsFilter).forEach((booking) => {
    worklogsDeleteService.delete(booking.tempoWorklogId)
  })

}

function bookFutureActThisMonth() {
  const now = moment().startOf('day')
  const then = now.clone().endOf('month')
  const googleCalendar = new cWrap.CalendarAppWrapper()

  bookWorklogs(now, then, googleCalendar.all(), actEventsFilter)
}

function bookLast30days() {
  const numLastDays = 30
  const now = moment()
  const then = now.clone().subtract(numLastDays, 'days')
  const googleCalendar = new cWrap.CalendarAppWrapper()

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
    if (Object.keys(this.errors).length > 0) {
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

  const issuesService = new jira.JiraIssueService(jiraApi)
  const worklogsSearchService = new jira.TempoWorklogSearchService(tempoApi, jiraApi)
  const worklogsBookService = new jira.TempoWorklogBookService(tempoApi, jiraApi)

  const collector = new ErrorCollector()
  const telemetry = t.Telemetry.forSeries('book_worklogs')
  telemetry.start()

  calendars.forEach((calendar) => {
    log.info(`checking ${calendar} from [${then}] to [${now}] using filter [${eventFilter}]`)
    const calendarEvents = calendar.getEvents(then, now).filter(eventFilter)
    log.fine(`${calendarEvents.length} events in calendar ${calendar}`)
    const withBookingInfo = calendarEvents.filter(entity.EventWrapper.withBookingInfo)
    log.fine(`Events with Booking info ${withBookingInfo.length}`)
    withBookingInfo.forEach((e) => log.finest(e))
    const withValidKeys = withBookingInfo.filter((event) => issuesService.hasValidKey(event))
    log.fine(`Events with valid keys ${withValidKeys.length}`)
    withValidKeys.forEach((e) => log.finest(e))
    const bookable = withValidKeys.filter((event) => worklogsSearchService.hasNoBooking(event))
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
