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
    log.fine(`getting calendar ${name}`)
    let calendars = this.calendarApp.getCalendarsByName(name).map(CalendarInstanceWrapper.fromApp)
    if (calendars.length == 0) {
      throw CalendarError(name, 'calendar not found by name')
    } else if (calendars.length > 1) {
      throw CalendarError(name, 'more than one calendar with this name')
    }
    log.finest(`getting calendar ${name}: ${calendars[0]}`)
    return calendars[0]
  }

  byId(_id) {
    log.fine(`getting calendar ${_id}`)
    let calendarById = this.calendarApp.getCalendarById(_id)
    if (!calendarById) {
      throw new CalendarError(_id, 'not found with id')
    }
    let calendar = CalendarInstanceWrapper.fromApp(calendarById)
    log.finest(`getting calendar ${_id}: ${calendar}`)
  }

  getDefault() {
    return CalendarInstanceWrapper.fromApp(this.calendarApp.getDefaultCalendar())
  }
}
