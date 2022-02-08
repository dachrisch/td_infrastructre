
function loadCalendars() {
  return CalendarApp.getAllOwnedCalendars().map(cal => { return { name: cal.getName(), id: cal.getId(), active: cal.getId() == getActiveCalendar().getId() } })
}

function setActiveCalendar(cal_id) {
  UserProperties.setProperties({ active_calendar: cal_id })
}

function getActiveCalendar() {
  let cal_id = UserProperties.getProperty('active_calendar')
  let calendar = CalendarApp.getCalendarById(cal_id)

  return calendar || CalendarApp.getDefaultCalendar()
}
