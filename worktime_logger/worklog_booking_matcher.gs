/**
 * @param {worklog} worklog to check
 * @param {Object} list of bookings
 * @return {worklog}
 */
function withBookingInfo(_worklog, bookings) {
  let matcher_booking = tempoBooking.fromElement(_worklog).toPayloadJson()
  let found_booking = bookings.find(booking => {
    let time_1 = new Date(matcher_booking.started)
    let time_2 = new Date(booking.started + 'Z')
    return time_1.getTime() == time_2.getTime() && matcher_booking.timeSpentSeconds == booking.timeSpentSeconds && matcher_booking.comment == booking.comment
  })

  if (found_booking) {
    _worklog.booking_info.booking_link = found_booking.originId
    _worklog.booking_info.issue_key = found_booking.issue.key
  }

  return _worklog
}
