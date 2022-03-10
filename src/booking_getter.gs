
/**
 *  Get booking in given date range
 *
 *  @param {Date} from_date
 *  @param {Date} to_date 
 *  @return {Array} Bookings in given range
 *
 */
function bookingsInRange(from_date, to_date) {
  let endpoint = 'https://jira.tdservice.cloud/rest/tempo-timesheets/4/worklogs/search'
  let payload = {
    from: moment(from_date).format('YYYY-MM-DD'),
    to: moment(to_date).format('YYYY-MM-DD'),
    worker: [
      worker().key
    ]
  }
  let bookings = post(endpoint, payload)
  return bookings
}

function bookingsInRangeFromTime(from_unix_ts, to_unix_ts) {
  return bookingsInRange(new Date(from_unix_ts), new Date(to_unix_ts))
}
