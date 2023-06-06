class BookingInfo {
  constructor(issue_key = null, billable = false, hour_factor = 1, booking_link = null) {
    this.issue_key = issue_key
    this.billable = billable
    this.hour_factor = hour_factor
    this.booking_link = booking_link
  }
  toString() {
    return `bookingInfo(${this.issue_key}, billable=${this.billable}, hour_factor=${this.hour_factor})`
  }
}

class worklog {
  /**
   * @param {object} event
   * @param {moment} event.startMoment
   * @param {moment} event.endMoment
   * @param {string} event.title
   * @param {string} event.eventId
   * @param {object} event.bookingInfo
   * @param {string} event.bookingInfo.issueKey
   * @param {boolean} event.bookingInfo.billable
   * @param {number} event.bookingInfo.hourFactor
   * @param {string} event.bookingInfo.bookingLink
   */
  static fromEvent(event) {

    return new worklog(event.startMoment.format('DD.MM.YYYY'), 
                        event.startMoment.format('HH:mm'),
                        event.endMoment.format('HH:mm'), 
                        event.title, 
                        new BookingInfo(event.bookingInfo.issueKey, event.bookingInfo.billable, event.bookingInfo.hourFactor, event.bookingInfo.bookingLink), 
                        event.eventId)
  }
  constructor(date,start_time, end_time, summary, booking_info, calendar_id) {
    this.date = date
    this.start_time=start_time
    this.end_time = end_time
    this.summary = summary
    this.booking_info = booking_info
    this.calendar_id = calendar_id
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
