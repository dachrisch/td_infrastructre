var EventWrapper = class EventWrapper extends Entity {
  /**
   * @param {CalendarApp.CalendarEvent} event
   * @see @link https://script.google.com/home/projects/1-N9OkafA2sQBYZjSbwtv5QYM7x4bB4DZJ-h2nryF1XPcX2GzNkNKQLnQ
   */
  static fromEvent(event) {
    let bookingInfo = BookingInfo.fromDescription(event.getDescription())
    return new EventWrapper(moment(event.getStartTime()), moment(event.getEndTime()), event.getTitle(), bookingInfo, event.getId())
  }

  /**
   * @param {object} selection
   * @param {object} selection.booking_info
   * @param {string} selection.booking_info.issue_key
   * @param {boolean} selection.booking_info.billable
   * @param {number} selection.booking_info.hour_factor
   * @param {string} selection.booking_info.booking_link
   * @param {string selection.date - DD.MM.YYYY
   * @param {string} selection.start_time - HH:mm
   * @param {string} selection.end_time - HH:mm
   * @param {string} selection.summary
   */
  static fromSelection(selection) {
    let bookingInfo = new BookingInfo(selection.booking_info.issue_key, selection.booking_info.billable, selection.booking_info.hour_factor, selection.booking_info.booking_link)
    let startMoment = moment(`${selection.date} ${selection.start_time}`, 'DD.MM.YYYY HH:mm')
    let endMoment = moment(`${selection.date} ${selection.end_time}`, 'DD.MM.YYYY HH:mm')
    return new EventWrapper(startMoment, endMoment, selection.summary, bookingInfo, selection.calendar_id)
  }

  /**
   * Filter function for events with booking info
   * @param {EventWrapper} eventWrapper
   */
  static withBookingInfo(eventWrapper) {
    return eventWrapper.bookingInfo.issueKey != null
  }

  /**
   * @param {moment} startMoment
   * @param {moment} endMoment
   * @param {String} title
   * @param {BookingInfo} bookingInfo
   * @param {String} eventId
   */
  constructor(startMoment, endMoment, title, bookingInfo, eventId) {
    super()
    this.startMoment = startMoment
    this.endMoment = endMoment
    this.title = title
    this.bookingInfo = bookingInfo
    this.eventId = eventId
  }

  duration() {
    return moment.duration(this.endMoment.diff(this.startMoment))
  }

  billingDuration() {
    let bd = 0
    if (this.bookingInfo.billable) {
      bd = (this.bookingInfo.hourFactor * this.duration().as('seconds')).toFixed()
    }
    return bd
  }

  updateBookingInfo(issueKey, billable, hourFactor) {
    let updatedEvent = new EventWrapper(this.startMoment, this.endMoment, this.title, new BookingInfo(issueKey, billable, hourFactor), this.eventId)
    return updatedEvent
  }
}
