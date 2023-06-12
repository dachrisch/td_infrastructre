function getWorklogsAsJson(from_unix_ts, to_unix_ts) {
  //api.log.setLevel(logger.Level.FINE)
  let from_date = moment(from_unix_ts)
  let to_date = moment(to_unix_ts)
  console.log(`get worklogs between ${from_date.toISOString()} and ${to_date.toISOString()}`)
  let events = getActiveCalendar().getEvents(from_date, to_date)

  mappedEvents = events.map((event) => {
    let mappedEvent = event
    let hasBookingInfo = entity.EventWrapper.withBookingInfo(event)
    if (hasBookingInfo) {
      let eventBookings = tempoSearchService().bookingsForEvent(event)
      if (eventBookings.length > 1) {
        throw `found ${eventBookings.length} booking for ${event}...cannot proceed`
      } else if (eventBookings.length == 1) {
        mappedEvent = event.updateBookingInfo(event.bookingInfo.issueKey, event.bookingInfo.billable, event.bookingInfo.hourFactor, eventBookings[0].tempoWorklogId)
      }
    }
    return mappedEvent
  })

  return mappedEvents.map(event => worklog.fromEvent(event))
}
