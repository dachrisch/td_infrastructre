function list_spreadsheets() {
  let files = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS)
  let spreadsheets = []
  while (files.hasNext()) {
    var file = files.next();
    Logger.log("%s - %s", file.getName(), file.getUrl());
    spreadsheets.push({ name: file.getName(), url: file.getUrl() })
  }
  return spreadsheets
}

function existing_trigger() {
  return ScriptApp.getProjectTriggers().filter(trigger => trigger.getHandlerFunction() == export_billings_current_quarter.name)
}

function remove_existing_triggers() {
  UserProperties.deleteProperty('billings.trigger.hour')
  UserProperties.deleteProperty('billings.spreadsheet.url')
  existing_trigger().forEach(trigger => ScriptApp.deleteTrigger(trigger))
}

function create_export_trigger(hour) {
  store_trigger_hour(hour)
  let export_trigger = ScriptApp.newTrigger(export_billings_current_quarter.name).timeBased().everyDays(1).atHour(hour).create()
  console.log(`creating new trigger [${export_trigger.getTriggerSource()}] for [${export_trigger.getHandlerFunction()}]`)
  return export_trigger
}

function billings_properties() {
  return Object.fromEntries(
    Object.entries(UserProperties.getProperties()).filter(
      ([key, val]) => key.startsWith('billings.')
    ))
}

function store_trigger_hour(hour) {
  UserProperties.setProperties({ 'billings.trigger.hour': hour })
}

function store_spreadsheet_url(spreadsheet_url) {
  Logger.info(`storing spreadsheet url [${spreadsheet_url}]`)
  UserProperties.setProperties({ 'billings.spreadsheet.url': spreadsheet_url })
}

function get_spreadsheet_url() {
  return UserProperties.getProperty('billings.spreadsheet.url')
}

function export_billings(spreadsheet_url, billings) {
  let billings_tab = empty_billing_tab(spreadsheet_url, moment(billings[0].date, "DD.MM.YYYY"))

  let header_rows = [['Date', 'From', 'To', 'Description', 'Booking Factor', 'Duration', 'Booking Duration']]
  let all_rows = header_rows.concat(billings.map(wl => [wl.date, wl.start_time, wl.end_time, wl.summary, wl.booking_info.hour_factor, 0, 0]))

  ensure_rows_available(billings_tab, all_rows)
  billings_tab.getRange(`A1:G${all_rows.length}`).setValues(all_rows)
  insert_duration_formulas(billings_tab)
  return billings
}

function main_calendar_billings_in_quarter(moment_in_quarter) {
  let from_date = new Date(moment_in_quarter.clone().startOf('quarter'))
  let to_date = new Date(moment_in_quarter.clone().endOf('quarter'))
  let worklogs = getCalendarByName('c.daehn@techdivision.com').getEvents(from_date, to_date).map(event => worklog.fromEvent(event).toJson())
  let bookings = bookingsInRange(from_date, to_date)
  let worklogs_with_link = worklogs.map(worklog => withBookingInfo(worklog, bookings))
  return worklogs_with_link.filter(wl => wl.booking_info.booking_link != null)
}

function billings_from_to(from_ts, to_ts) {
  let from_date = new Date(from_ts)
  let to_date = new Date(to_ts)
  let worklogs = getActiveCalendar().getEvents(from_date, to_date).map(event => worklog.fromEvent(event).toJson())
  let bookings = bookingsInRange(from_date, to_date)
  let worklogs_with_link = worklogs.map(worklog => withBookingInfo(worklog, bookings))
  return worklogs_with_link.filter(wl => wl.booking_info.booking_link != null)
}

/**
 * @param {SpreadsheetApp.Sheet} tab
 */
function ensure_rows_available(tab, rows) {
  let rows_present = tab.getMaxRows()
  let rows_needed = rows.length
  if (rows_present < rows_needed) {
    tab.insertRowsAfter(rows_present, rows_needed - rows_present)
  }
}
function empty_billing_tab(sheet_url, moment_in_quarter) {
  let billings_sheet = SpreadsheetApp.openByUrl(sheet_url)
  let sheet_name = `${moment_in_quarter.year()}/${moment_in_quarter.quarter()}`
  let billings_tab = billings_sheet.getSheetByName(sheet_name)
  if (!billings_tab) {
    billings_tab = billings_sheet.insertSheet()
    billings_tab.setName(sheet_name)
    billings_sheet.moveActiveSheet(billings_sheet.getSheets().length)
  }
  billings_tab.clear()

  return billings_tab
}

/**
 * @param {Sheet} - tab 
 */
function insert_duration_formulas(tab) {
  let duration_range = `F2:G${tab.getMaxRows()}`
  let duration_cell = tab.getRange(duration_range)
  let formulas = ["=ABS(R[0]C[-3]-R[0]C[-4])*24", "=R[0]C[-1]*R[0]C[-2]"]
  tab.setActiveRange(duration_cell)
  duration_cell.setFormulasR1C1(Array(tab.getMaxRows() - 1).fill(formulas))
  console.log(`setting formula for cell [${duration_cell.getA1Notation()}]: ${formulas}`)
}

