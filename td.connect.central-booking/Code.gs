/**
 * @param {String} ticketUrl - ticket to retrieve bookings from (e.g.: https://jira.tdservice.cloud/browse/ABC-123)
 * @param {String} bookingDate - Date of bookings (DD.MM.YYYY)
 * @param {String} bookingComment - Comments to retrieve bookings
 * @param {String} userEmail - Email of user to obtain bookings from
 * @param {String} dateInMonth - some date in month (DD.MM.YYYY)
 * @return {Number} - sum of hours of all tickets in given month
 */
function hoursBilledInTicketComment(ticketUrl, bookingDate, bookingComment, userEmail) {
  return tdbillings.hoursBilledInTicketComment(ticketUrl, bookingDate, bookingComment, userEmail)
}

/** * @OnlyCurrentDoc */
function book() {
  tdbillings.bookBillingsFromNamedRangeForUser('booking.entries.with.header')
}
