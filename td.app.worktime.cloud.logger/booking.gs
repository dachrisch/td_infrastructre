function bookLast30days(numLastDays = 30) {
  let now = moment()
  let then = moment().subtract(numLastDays, 'days')

  let googleCalendar = new CalendarAppWrapper()
  bookWorklogs(then, now, googleCalendar.all())
}

/**
 * @param {moment} then
 * @param {moment} then
 * @param {Array.<CalendarInstanceWrapper>} calendars
 */
function bookWorklogs(then, now, calendars) {
  let issuesService = new JiraIssueService()
  let jiraMyselfService = new JiraMyselfService()
  let worklogsService = new TempoWorklogsService(issuesService, jiraMyselfService)

  let telemetry=Telemetry.forSeries('book_worklogs')
  telemetry.start()

  calendars.forEach((calendar) => {
    log.info(`checking ${calendar}`)
    let calendarEvents = calendar.getEvents(then, now)
    log.fine(`Events in calendar ${calendarEvents.length}`)
    let withBookingInfo = calendarEvents.filter(EventWrapper.withBookingInfo)
    log.fine(`Events with Booking info ${withBookingInfo.length}`)
    let withValidKeys = withBookingInfo.filter((event) => issuesService.hasValidKey(event))
    log.fine(`Events with valid keys ${withValidKeys.length}`)
    let bookable = withValidKeys.filter((event) => worklogsService.hasNoBooking(event))
    log.info(`${bookable.length} Events without existing bookings: ${bookable}`)
    telemetry.count(bookable.length, `${calendar.name}: ${bookable}` )
    bookable.forEach((event) => {
      worklogsService.book(event)
    })
  })
  telemetry.end()
}

function bookSingle() {
  let now = moment("31-05-2023", "DD-MM-YYYY")
  let then = moment("25-05-2023", "DD-MM-YYYY")
  let googleCalendar = new CalendarAppWrapper()

  bookWorklogs(then, now, googleCalendar.byName('worktimes'))
}