class bookingInfo {
  static BOOKING_PARAMS() {
    return {
      protocol: 'booking',
      billable: 'billable',
      hour_factor: 'hourFactor'
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
      return new bookingInfo(booking_uri.hostname(), query_parameter[this.BOOKING_PARAMS().billable] == 'true', parseFloat(query_parameter[this.BOOKING_PARAMS().hour_factor] || 1))
    } else {
      return new bookingInfo()
    }
  }

  static filterBookingLine(description) {
    let booking_line = ''
    if (description) {
      booking_line = description.replace(/<br>/g, "\n").replace(/<\/?[^>]+(>|$)/g, "").split('\n').filter(line => line.startsWith(this.BOOKING_PARAMS().protocol))[0]
    }
    return booking_line
  }

  constructor(issue_key = null, billable = false, hour_factor = 1, booking_link = null) {
    this.issue_key = issue_key
    this.billable = billable
    this.hour_factor = hour_factor
    this.booking_link = booking_link
  }
  toString() {
    return `bookingInfo(${this.issue_key}, billable=${this.billable}, hour_factor=${this.hour_factor})`
  }

  toDescriptionString(old_description = '') {
    let new_description = `${bookingInfo.BOOKING_PARAMS().protocol}://${this.issue_key}?${bookingInfo.BOOKING_PARAMS().billable}=${this.billable}&${bookingInfo.BOOKING_PARAMS().hour_factor}=${this.hour_factor}`
    let old_remaining = old_description.replaceAll(/^booking:\/\/.*$/gm, '')
    if (old_remaining) {
      new_description += '\n' + old_remaining
    }
    return new_description.trim()
  }
}

class worklog {
  static fromEvent(event) {

    return new worklog(event.getStartTime(), event.getEndTime(), event.getTitle(), bookingInfo.fromDescription(event.getDescription()), event.getId())
  }
  constructor(start_date, end_date, summary, booking_info, calendar_id = null) {
    this.start_date = start_date
    this.end_date = end_date
    this.summary = summary
    this.booking_info = booking_info
    this.calendar_id = calendar_id
  }
  toJson() {
    return {
      date: this.start_date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      start_time: this.start_date.toLocaleTimeString('de-DE', { hour12: false, timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' }),
      end_time: this.end_date.toLocaleTimeString('de-DE', { hour12: false, timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' }),
      summary: this.summary,
      booking_info: this.booking_info,
      calendar_id: this.calendar_id
    }
  }

  toString() {
    return `worklog(${this.start_date.toISOString()}, ${this.end_date.toISOString()}, ${this.summary}, ${this.booking_info}})`
  }

}

class worklogs_range {
  constructor(_from, _to, worklogs) {
    this._from = _from
    this._to = _to
    this.worklogs = worklogs
  }

  toJson() {
    return this.worklogs.map(worklog => worklog.toJson())
  }
}
