/**
 * @param {Object} event
 * @param {string} event.title
 */
const kaEventsFilter = function(event) {
  return event.title === 'KA'
}

const actEventsFilter = function(event) {
  return event.title === 'ACT'
}

/**
 * @param {Object} booking
 * @param {string} booking.description
 */
const kaBookingsFilter = function(booking) {
  return booking.description === 'KA'
}

const actBookingsFilter = function(booking) {
  return booking.description === 'ACT'
}

const anyEventsFilter = function(event) {
  return true
}

