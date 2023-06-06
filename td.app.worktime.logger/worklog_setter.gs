function configure_selections(selections, issue_key, billable = false, hour_factor = 1) {

  if (!issue_key) {
    throw 'issue_key is required'
  }

  const configured_events = selections.map(selection => {
    let calendarEvent = entity.EventWrapper.fromSelection(selection)

    console.log(`updating ${calendarEvent} with ${issue_key}, ${billable}, ${hour_factor}...`)
    let updatedEvent = calendarEvent.updateBookingInfo(issue_key, billable, hour_factor)
    getActiveCalendar().saveEvent(updatedEvent)
    return worklog.fromEvent(updatedEvent)
  })
  console.log(configured_events)
  return configured_events
}
