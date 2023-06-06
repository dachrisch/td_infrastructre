function getWorklogsAsJson(from_unix_ts, to_unix_ts) {
  let from_date = new Date(from_unix_ts)
  let to_date = new Date(to_unix_ts)
  console.log(`get worklogs between ${from_date.toISOString()} and ${to_date.toISOString()}`)
  let events = getActiveCalendar().getEvents(from_date, to_date)

  mappedEvents = events.map((event) => {
    let mappedEvent = event
    let hasBookingInfo = entity.EventWrapper.withBookingInfo(event)
    if (hasBookingInfo) {
      let hasValidKey = jiraIssueService().hasValidKey(event)
      if (hasValidKey) {
        let eventBookings = tempoSearchService().bookingsForEvent(event)
        if (eventBookings.length > 1) {
          throw `found ${eventBookings.length} booking for ${event}...cannot proceed`
        } else if (eventBookings.length == 1) {
          mappedEvent = event.updateBookingInfo(event.bookingInfo.issueKey, event.bookingInfo.billable, event.bookingInfo.hourFactor, eventBookings[0].tempoWorklogId)
        }
      }
    }
    return mappedEvent
  })

  return mappedEvents.map(event => worklog.fromEvent(event))
}
