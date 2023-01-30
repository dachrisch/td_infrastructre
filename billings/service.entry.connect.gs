
/**
 * @param {String} ticketUrl - ticket to retrieve bookings from (e.g.: https://jira.tdservice.cloud/browse/ABC-123)
 * @param {String} bookingDate - Date of bookings (DD.MM.YYYY)
 * @param {String} bookingComment - Comments to retrieve bookings
 * @param {String} userEmail - Email of user to obtain bookings from
 * @param {String} dateInMonth - some date in month (DD.MM.YYYY)
 * @return {Number} - sum of hours of all tickets in given month
 */
function hoursBilledInTicketComment(ticketUrl, bookingDate, bookingComment, userEmail) {
  if (!ticketUrl) {
    throw new InvalidParameterError('ticketUrl', 'missing')
  }
  if (!userEmail) {
    throw new InvalidParameterError('userEmail', 'missing')
  }
  if (!bookingDate) {
    throw new InvalidParameterError('bookingDate', 'missing')
  }

  try {
    var taskKey = new URI(ticketUrl).filename()
  } catch (e) {
    if (e instanceof TypeError) {
      throw new InvalidParameterError('ticketUrl', 'invalid')
    } else {
      throw e
    }
  }
  let tempoToken = new TempoTokenService().getToken()
  return SummableBillingsService.connect(tempoToken, userEmail).getTasksInDay(taskKey, moment(bookingDate, 'DD.MM.YYYY'), bookingComment).duration().as('hours')
}



function test_service_entry_connect() {
  log.info(hoursBilledInTicketComment('https://jira.tdservice.cloud/browse/TDACC-737', '24.12.2022', 'Test Buchung ATC Umlage', 'l.hertkorn@techdivision.com'))
  log.info(hoursBilledInTicketMonth('https://jira.tdservice.cloud/browse/TDACC-737', 'l.hertkorn@techdivision.com', '31.12.2022'))
}