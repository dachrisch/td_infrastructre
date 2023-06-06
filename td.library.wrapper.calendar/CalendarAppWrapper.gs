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
    let calendars = this.calendarApp.getCalendarsByName(name).map(CalendarInstanceWrapper.fromApp)
    if (calendars.length == 0) {
      throw CalendarError(name, 'calendar not found by name')
    } else if (calendars.length > 1) {
      throw CalendarError(name, 'more than one calendar with this name')
    }
    return calendars[0]
  }

  byId(_id) {
    let calendarById = this.calendarApp.getCalendarById(_id)
    if (!calendarById) {
      throw new CalendarError(_id, 'not found with id')
    }

    return CalendarInstanceWrapper.fromApp(calendarById)
  }

  getDefault() {
    return CalendarInstanceWrapper.fromApp(this.calendarApp.getDefaultCalendar())
  }
}
