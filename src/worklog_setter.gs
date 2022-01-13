function configure_selections(selections, issue_key, billable = false, hour_factor = 1) {

  if (!issue_key) {
    throw 'issue_key is required'
  }

  let booking_info = new bookingInfo(issue_key, billable, hour_factor)
  const configured_events = selections.map(selection => {
    let calendar_event = CalendarApp.getEventById(selection.calendar_id)
    if (!calendar_event) {
      // maybe not in this calendar
      // XXX - https://issuetracker.google.com/issues/151142698?pli=1
      let entry = tempoBooking.fromElement(selection)
      calendar_event = CalendarApp.getEvents(entry.start_date, new Date(moment(entry.start_date).add(entry.duration, 'seconds'))).filter(event => event.getId() == selection.calendar_id)[0]
    }
    if (!calendar_event) {
      throw `no event found for ${selection.calendar_id}`
    }

    console.log(`updating ${JSON.stringify(selection)} with ${booking_info}...`)
    calendar_event.setDescription(booking_info.toDescriptionString(calendar_event.getDescription()))
    return worklog.fromEvent(calendar_event).toJson()
  })
  console.log(configured_events)
  return configured_events
}
