function deleteBookingsById(bookings) {
  bookings.forEach(booking => deleteBooking(booking))
  return bookings
}

function deleteBooking(booking) {
  let endpoint = 'https://jira.tdservice.cloud/rest/tempo-timesheets/4/worklogs/' + booking.originId
  delete_fetch(endpoint)
  return booking
}
