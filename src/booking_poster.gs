function book_selections(selections, default_issue) {
  let worker_key = worker().key
  return selections.map(selection => {
    let booking = tempoBooking.fromElement(selection, default_issue)
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