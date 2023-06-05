class BookingInfo extends Entity {
  static BOOKING_PARAMS() {
    return {
      protocol: 'booking',
      billable: 'billable',
      hourFactor: 'hourFactor'
    }
  }
  static fromDescription(description) {
    let booking_line = this.filterBookingLine(description)
    let booking_uri = new URI((booking_line || '').replace(/&amp;/g, "&").trim())
    if (this.BOOKING_PARAMS().protocol == booking_uri.protocol()) {
      let query_parameter = booking_uri.query().split('&').reduce(function (map, parameter) {
        let [key, value] = parameter.split('=')
        if (key) {
          map[key] = value
        }
        return map
      }, {})
      return new BookingInfo(booking_uri.hostname(), query_parameter[this.BOOKING_PARAMS().billable] == 'true', parseFloat(query_parameter[this.BOOKING_PARAMS().hourFactor] || 1))
    } else {
      return new BookingInfo()
    }
  }

  static filterBookingLine(description) {
    let booking_line = ''
    if (description) {
      booking_line = description.replace(/<br>/g, "\n").replace(/<\/?[^>]+(>|$)/g, "").split('\n').filter(line => line.startsWith(this.BOOKING_PARAMS().protocol))[0]
    }
    return booking_line
  }

  constructor(issueKey = null, billable = false, hourFactor = 1, bookingLink = null) {
    super()
    this.issueKey = issueKey
    this.billable = billable
    this.hourFactor = hourFactor
    this.bookingLink = bookingLink
  }
}