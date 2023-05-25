class CalendarAppWrapper extends Entity {
  constructor() {
    super()
    this.calendarApp = CalendarApp
  }

  all() {
    return this.calendarApp.getCalendarsByName('Test-Tempo').map(CalendarInstanceWrapper.fromApp)
    return this.calendarApp.getAllOwnedCalendars().map(CalendarInstanceWrapper.fromApp)
  }
}
