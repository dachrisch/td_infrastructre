class CalendarInstanceWrapper extends entity.Entity {
  /**
   * @param {CalendarApp.Calendar} calendar
   */
  static fromApp(calendar) {
    return new CalendarInstanceWrapper(calendar.getName(), calendar)
  }

  /**
   * @param {CalendarApp.Calendar} calendar
   * 
   */
  constructor(name, calendar) {
    super()
    this.name = name
    this.calendar = calendar
  }

  /**
   * @param {moment} fromMoment
   * @param {moment} toMoment
   * @returns {EventWrapper}
   * @see @link https://script.google.com/home/projects/1R83PIhOu4_HmnP2OHGSuHYdntwm7wYWjCn88URTDGauD5LVwTVSgkdAM
   */
  getEvents(fromMoment, toMoment) {
    return this.calendar.getEvents(new Date(fromMoment), new Date(toMoment)).map(entity.EventWrapper.fromEvent)
  }
}
