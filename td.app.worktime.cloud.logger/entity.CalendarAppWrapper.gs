class CalendarAppWrapper extends Entity {
  constructor() {
    super()
    this.calendarApp = CalendarApp
    log.fine(`Connected to ${this}`)
  }

  /**
   * @returns {CalendarInstanceWrapper}
   */
  all() {
    if (globalTest) {
      return this.calendarApp.getCalendarsByName('Test-Tempo').map(CalendarInstanceWrapper.fromApp)
    } else {
      return this.calendarApp.getAllOwnedCalendars().map(CalendarInstanceWrapper.fromApp)
    }
  }

  byName(name) {
    return this.calendarApp.getCalendarsByName(name).map(CalendarInstanceWrapper.fromApp)
  }
}
