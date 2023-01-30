/**
 * function called from sheet appscript
 */
function bookBillingsFromNamedRange() {
  let token = authenticate()
  let sheetConnector = new BookingSheetConnector(SpreadsheetApp.getActiveSpreadsheet())
  let bookingService = new BookingService(new api.ApiConnector('https://jira.tdservice.cloud/rest/tempo-timesheets/4/worklogs', token), OtherIdentityService.connect(token, sheetConnector.userEmail()))

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
