class CalendarInstanceWrapper extends Entity {
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
   */
  getEvents(fromMoment, toMoment) {
    return this.calendar.getEvents(new Date(fromMoment), new Date(toMoment)).map(EventWrapper.fromEvent)
  }
}