/**
 * @param {Object} event
 * @param {string} event.title
 */
const kaEventsFilter = function(event) {
  return event.title === 'KA'
}

/**
 * @param {Object} booking
 * @param {string} booking.description
 */
const kaBookingsFilter = function(booking) {
  return booking.description === 'KA'
}

const anyEventsFilter = function(event) {
  return true
}

