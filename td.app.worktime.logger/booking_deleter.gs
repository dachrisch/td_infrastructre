function deleteBookingsById(bookings) {
  bookings.forEach(booking => deleteBooking(booking))
  return bookings
}

function scriptProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key)
}

function deleteBooking(booking) {
  tempoDeleteService().delete(booking.issue.id)
  return booking
}
