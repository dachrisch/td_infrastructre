function book_workklogs_last_30_days() {
  loadCalendars().forEach((calendar) => {
    Logger.info(`booking worklogs from [${calendar.name}]`)
    let unbooked = unbooked_billables(CalendarApp.getCalendarById(calendar.id), moment().subtract(30, 'days'), moment())
    Logger.info(`booking ${unbooked.length} worklogs...`)
    book_selections(unbooked)
    UrlFetchApp.fetch(`https://cronitor.link/p/ce20477d5d4e46db988db0ff8cc196f0/td_booking?message=booking&metric=count:${unbooked.length}`)
  })
}

function unbooked_billables(calendar, from_ts, to_ts) {
  let from_date = new Date(from_ts)
  let to_date = new Date(to_ts)
  let worklogs = calendar.getEvents(from_date, to_date).map(event => worklog.fromEvent(event).toJson())
  let bookings = bookingsInRange(from_date, to_date)
  let worklogs_with_link = worklogs.map(worklog => withBookingInfo(worklog, bookings))
  return worklogs_with_link.filter(wl => wl.booking_info.booking_link == null && wl.booking_info.issue_key != null)
}

function book_selections(selections) {
  let worker_key = worker().key
  return selections.map(selection => {
    let booking = tempoBooking.fromElement(selection)
    booking.booking_info.issue_id = issueId(booking.booking_info.issue_key)
    booking.worker_key = worker_key
    return book(booking)
  })
}

function book(tempo_booking) {
  console.info(`booking ${JSON.stringify(tempo_booking)}`)
  return post_worklog(tempo_booking)[0]
}

function connectToTempo() {
  let name = worker().displayName
  console.log(`connected ${name}`)
  return name
}

function store_tempo_token(token) {
  UserProperties.setProperties({ 'tempo_token': token })
}

function tempo_token() {
  return UserProperties.getProperty('tempo_token')
}

function deleteTempoToken() {
  store_tempo_token('')
}