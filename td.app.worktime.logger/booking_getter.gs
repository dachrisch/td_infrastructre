/**
 *  Get booking in given date range
 *
 *  @param {Date} from_date
 *  @param {Date} to_date 
 *  @return {Array} Bookings in given range
 *
 */
function bookingsInRange(from_date, to_date) {
  let bookings = tempoSearchService().bookingsInTimerange(moment(from_date), moment(to_date))
  return bookings.map((booking) => TempoBookingWrapperService.getInstance().fromTempo(booking))
}

function bookingsInRangeFromTime(from_unix_ts, to_unix_ts) {
  return bookingsInRange(new Date(from_unix_ts), new Date(to_unix_ts))
}
