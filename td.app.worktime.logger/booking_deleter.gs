function deleteBookingsById(bookings) {
  bookings.forEach(booking => deleteBooking(booking))
  return bookings
}

function deleteBooking(booking) {
  tempoDeleteService().delete(booking.worklogId)
  return booking
}
