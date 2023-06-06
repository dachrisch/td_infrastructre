var CalendarError = class CalendarError extends Error {
  constructor(calendar, reason) {
    let message = `error while accessing [${calendar}]: ${reason}`
    super(message)
    this.reason = reason
    this.calendar = calendar;
    this.name = 'CalendarError';
  }
}
