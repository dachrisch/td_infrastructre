/**
 * @param {worklog} worklog to check
 * @param {Object} list of bookings
 * @return {worklog}
 */
function withBookingInfo(_worklog, bookings) {
  console.log(`checking if [${JSON.stringify(_worklog)}] already has a booking`)
  let matcher_booking = tempoBooking.fromElement(_worklog).toPayloadJson()
  let found_booking = bookings.find(booking => {
    let time_1 = new Date(matcher_booking.started)
    let time_2 = new Date(booking.started + 'Z')
    //console.log(`candidate ${time_1.toISOString()} <> ${time_2.toISOString()}, ${matcher_booking.timeSpentSeconds} <> ${booking.timeSpentSeconds}, ${matcher_booking.comment} <> ${booking.comment}`)
    return time_1.getTime() == time_2.getTime() && matcher_booking.timeSpentSeconds == booking.timeSpentSeconds && matcher_booking.comment == booking.comment
  })

  if (found_booking) {
    _worklog.booking_info.booking_link = found_booking.originId
    _worklog.booking_info.issue_key = found_booking.issue.key
    console.log(`booking link: ${_worklog.booking_info.booking_link}`)
  }

  return _worklog
}
