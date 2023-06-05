var CalendarAppWrapper = class CalendarAppWrapper extends entity.Entity {
  constructor() {
    super()
    this.calendarApp = CalendarApp
    log.fine(`Connected to ${this}`)
  }

  /**
   * @returns {CalendarInstanceWrapper}
   */
  all() {
    return this.calendarApp.getAllOwnedCalendars().map(CalendarInstanceWrapper.fromApp)
  }

  byName(name) {
    return this.calendarApp.getCalendarsByName(name).map(CalendarInstanceWrapper.fromApp)
  }
}
