class EventWrapper extends Entity {
  /**
   * @param {CalendarApp.CalendarEvent} event
   */
  static fromEvent(event) {
    let bookingInfo = BookingInfo.fromDescription(event.getDescription())
    return new EventWrapper(moment(event.getStartTime()), moment(event.getEndTime()), event.getTitle(), bookingInfo, event.getId())
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
}
