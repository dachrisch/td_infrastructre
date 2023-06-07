function bookLast30days() {
  let numLastDays = 30
  let now = moment()
  let then = now.clone().subtract(numLastDays, 'days')
  let googleCalendar = new cWrap.CalendarAppWrapper()

  bookWorklogs(then, now, googleCalendar.all())
}

/**
 * @param {moment} then
 * @param {moment} then
 * @param {Array.<CalendarInstanceWrapper>} calendars
 */
function bookWorklogs(then, now, calendars) {
  let username = Session.getActiveUser().getEmail()
  let jiraApi = null
  let tempoApi = null
  if (globalTest) {
    jiraApi = api.createBasic(scriptProperty('jiraTestEndpoint'), username, scriptProperty('jiraToken'))
    tempoApi = api.createBearer(scriptProperty('tempoEndpoint'), scriptProperty('tempoTestToken'))
  } else {
    jiraApi = api.createBasic(scriptProperty('jiraEndpoint'), username, scriptProperty('jiraToken'))
    tempoApi = api.createBearer(scriptProperty('tempoEndpoint'), scriptProperty('tempoToken'))
  }

  let issuesService = new jira.JiraIssueService(jiraApi)
  let worklogsSearchService = new jira.TempoWorklogSearchService(tempoApi, jiraApi)
  let worklogsBookService = new jira.TempoWorklogBookService(tempoApi, jiraApi)

  let telemetry = t.Telemetry.forSeries('book_worklogs')
  telemetry.start()

  calendars.forEach((calendar) => {
    log.info(`checking ${calendar} from [${then}] to [${now}]`)
    let calendarEvents = calendar.getEvents(then, now)
    log.fine(`${calendarEvents.length} events in calendar ${calendar}`)
    let withBookingInfo = calendarEvents.filter(entity.EventWrapper.withBookingInfo)
    log.fine(`Events with Booking info ${withBookingInfo.length}`)
    withBookingInfo.forEach((e) => log.finest(e))
    let withValidKeys = withBookingInfo.filter((event) => issuesService.hasValidKey(event))
    log.fine(`Events with valid keys ${withValidKeys.length}`)
    withValidKeys.forEach((e) => log.finest(e))
    let bookable = withValidKeys.filter((event) => worklogsSearchService.hasNoBooking(event))
    log.info(`${bookable.length} Events without existing bookings`)
     bookable.forEach((e)=> log.info(e))
    telemetry.count(bookable.length, `${calendar.name}: ${bookable.length}`)
    bookable.forEach((event) => {
      worklogsBookService.book(event)
    })
  })
  telemetry.end()
}

function bookSingle() {
  let now = moment("31-05-2023", "DD-MM-YYYY")
  let then = moment("25-05-2023", "DD-MM-YYYY")
  let googleCalendar = new cWrap.CalendarAppWrapper()

  bookWorklogs(then, now, googleCalendar.byName('worktimes'))
}