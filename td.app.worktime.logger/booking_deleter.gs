function deleteBookingsById(bookings) {
  bookings.forEach(booking => deleteBooking(booking))
  return bookings
}

function deleteBooking(booking) {
  tempoDeleteService().delete(booking.issue.id)
  return booking
}
