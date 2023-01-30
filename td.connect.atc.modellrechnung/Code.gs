/**
 * @OnlyCurrentDoc
 * @param {String} ticketUrl - URL / link to Jira / Tempo Ticket where bookings are stored
 * @param {String} userEmail - Email of the user which records to retrieve
 * @param {String} dateInMonth - A date in month for which to retrieve bookings / format DD.MM.YYYY
 * @return {Number} - number of hours billed 
 */
function hoursBilledInTicketMonth(ticketUrl, userEmail, dateInMonth) {
  return tdbillings.hoursBilledInTicketMonth(ticketUrl, userEmail, dateInMonth)
}

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
  tdbillings.bookBillingsFromNamedRange('booking.range', 'booking.email')
}
