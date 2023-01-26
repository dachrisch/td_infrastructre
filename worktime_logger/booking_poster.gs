function book_workklogs_last_30_days() {
  let now = moment()
  UrlFetchApp.fetch(`https://cronitor.link/p/e785985352b14396982fa07f4ec0afb3/hJICeq?state=run&series=book_worklogs_${now}`)
  loadCalendars().forEach((calendar) => {
    let pre_message = `booking worklogs from [${calendar.name}]`
    Logger.info(pre_message)
    let unbooked = unbooked_billables(CalendarApp.getCalendarById(calendar.id), moment().subtract(30, 'days'), moment())
    let post_message = `booking ${unbooked.length} worklogs...`
    Logger.info(post_message)
    book_selections(unbooked)
    UrlFetchApp.fetch(`https://cronitor.link/p/e785985352b14396982fa07f4ec0afb3/hJICeq?series=book_worklogs_${now}&metric=count:${unbooked.length}&message=${pre_message},${post_message}`)
  })
  UrlFetchApp.fetch(`https://cronitor.link/p/e785985352b14396982fa07f4ec0afb3/hJICeq?state=complete&series=book_worklogs_${now}`)
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
    let account = issueAccount(booking.booking_info.issue_key)
    if (account) {
      booking.booking_info.account_name = issueAccount(booking.booking_info.issue_key)['key']
    }
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