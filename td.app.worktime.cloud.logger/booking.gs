function bookWorklogs(numLastDays = 30) {
  let now = moment()
  let then = moment().subtract(numLastDays, 'days')
  let googleCalendar = new CalendarAppWrapper()
  let issuesService = new JiraIssueService()
  let jiraMyselfService = new JiraMyselfService()
  let worklogsService = new TempoWorklogsService(issuesService, jiraMyselfService)

  log.fine(`Connected to ${googleCalendar}`)

  googleCalendar.all().forEach((calendar) => {
    log.info(`checking ${calendar}`)
    let calendarEvents = calendar.getEvents(then, now)
    log.fine(`Events in calendar ${calendarEvents.length}`)
    let withBookingInfo = calendarEvents.filter(EventWrapper.withBookingInfo)
    log.fine(`Events with Booking info ${withBookingInfo.length}`)
    let withValidKeys = withBookingInfo.filter((event) => issuesService.hasValidKey(event))
    log.fine(`Events with valid keys´ ${withValidKeys.length}`)
    let bookable = withValidKeys.filter((event) => worklogsService.hasNoBooking(event))
    log.info(`${bookable.length} Events without existing bookings: ${bookable}`)
    bookable.forEach((event) => {
      worklogsService.book(event)
    })
  })
}
