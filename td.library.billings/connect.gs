/**
 * call this function in order to snapshot billings from {dateFromString} until now
 * 
 * @param {String} token - tempo token
 * @param {String} dateFromString - date to start export (DD.MM.YYYY)
 * @param {String|URI} spreadsheetUrl - active spreadsheet if undefined, else spreadsheet url
 */
function snapshotBillings(token, dateFromString, spreadsheetUrl = undefined) {
  let billingsService = AllCurrentUserBillingsService.connect(token)
  let exportService = new ExportBillingsService(billingsService)
  let spreadsheet = (spreadsheetUrl == undefined) ? sw.SpreadsheetWrapper.fromActive() : sw.SpreadsheetWrapper.fromUrl(spreadsheetUrl)


  exportService.exportUntil(moment(dateFromString, 'DD.MM.YYYY'), moment()).toSheet(spreadsheet).createForecast()
}

function test() {
 snapshotBillings(ScriptProperties.getProperty('tempo.token'), '01-01-2022', 'https://docs.google.com/spreadsheets/d/11Z9L9FhiRLD-KuOrYsMdSumAIoEApu3Cgm_1I7a3bRA/') 
}