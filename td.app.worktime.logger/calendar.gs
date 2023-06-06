
function loadCalendars() {
  return calendarWrapper().all().map(cal => { return { name: cal.name, id: cal.id, active: cal.id == getActiveCalendar().id } })
}

function setActiveCalendar(cal_id) {
  PropertiesService.getUserProperties().setProperties({ active_calendar: cal_id })
}

function getActiveCalendar() {
  let cal_id = PropertiesService.getUserProperties().getProperty('active_calendar')
  let calendar= calendarWrapper().getDefault()
  try {
    calendar = calendarWrapper().byId(cal_id)
  } catch (e) {
    if (e instanceof cWrap.CalendarError) {
      // pass (use default)
    } else {
      throw e
    }
  }

  return calendar
}

function getCalendarByName(name) {
  return calendarWrapper().byName(name)
}

function test_cal() {
  console.log(getCalendarByName('c.daehn@techdivision.com'))
}

function calendarWrapper() {
  return new cWrap.CalendarAppWrapper()
}
