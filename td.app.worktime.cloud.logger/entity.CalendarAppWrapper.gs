class CalendarAppWrapper extends Entity {
  constructor() {
    super()
    this.calendarApp = CalendarApp
  }

  all() {
    if (globalTest) {
      return this.calendarApp.getCalendarsByName('Test-Tempo').map(CalendarInstanceWrapper.fromApp)
    } else {
      return this.calendarApp.getAllOwnedCalendars().map(CalendarInstanceWrapper.fromApp)
    }
  }
}
