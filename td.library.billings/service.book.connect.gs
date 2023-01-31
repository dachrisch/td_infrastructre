/**
 * function called from sheet appscript
 */
function bookBillingsFromNamedRange(namedRangeValues, namedRangeEmail, spreadsheetId, _token) {
  let spreadsheet = (spreadsheetId == undefined) ? SpreadsheetApp.getActiveSpreadsheet() : SpreadsheetApp.openById(spreadsheetId)
  let token = (_token == undefined) ? authenticate() : _token

  let sheetConnector = new BookingSheetConnector(new NamedRangeRetriever(spreadsheet, namedRangeValues), new SingleUserDateTicketRowToValueMapper(OtherIdentityService.connect(token, new NamedRangeRetriever(spreadsheet, namedRangeEmail).value())))
  let bookingService = BookingService.create(token)

  sheetConnector.bookingValues().forEach(bookingValue => bookingService.bookEntry(bookingValue))

  sheetConnector.updateFormulasInBookingRange()
}

/**
 * function called from sheet appscript
 * @param {String} namedRange - name of the range with data
 * @param {String} spreadsheetId - used for testing, SpreadsheetApp.getActiveSpreadsheet() when empty
 * @param {String} token - used for testing, authenticate() when empty
 */
function bookBillingsFromNamedRangeForUser(namedRange, spreadsheetId, _token) {
  let spreadsheet = (spreadsheetId == undefined) ? SpreadsheetApp.getActiveSpreadsheet() : SpreadsheetApp.openById(spreadsheetId)
  let token = (_token == undefined) ? authenticate() : _token

  let sheetConnector = new BookingSheetConnector(new NamedRangeRetriever(spreadsheet, namedRange), new MultiUserDateTicketRowToValueMapper(token))
  let bookingService = BookingService.create(token)

  sheetConnector.bookingValues().forEach(bookingValue => bookingService.bookEntry(bookingValue))

  sheetConnector.updateFormulasInBookingRange()
}

function authenticate() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt("Please enter tempo token");
  var button = result.getSelectedButton();

  if (button === ui.Button.OK) {
    let tempoToken = result.getResponseText()
    return tempoToken
  } else if (button === ui.Button.CLOSE) {
    throw new Error('not authenticated')
  }
}
