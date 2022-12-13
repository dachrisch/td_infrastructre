eval(UrlFetchApp.fetch('https://rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());

function test() {
  let billingsService = AllCurrentUserBillingsService.connect('NTc2MDgyMTA1MjgzOpkPV0qVEijWuNpXRwI9XYbt9586')
  let exportService = new ExportBillingsService(billingsService)
  let spreadsheet = sw.SpreadsheetWrapper.fromUrl('https://docs.google.com/spreadsheets/d/11Z9L9FhiRLD-KuOrYsMdSumAIoEApu3Cgm_1I7a3bRA/edit#gid=0')

  exportService.exportYear(moment('2022-11-01')).analyzable(spreadsheet).createForecast()

}


function test2() {
  let billingsService = SingleTaskOtherUserBillingsService.connect('NTc2MDgyMTA1MjgzOpkPV0qVEijWuNpXRwI9XYbt9586', 'l.hertkorn@techdivision.com')
  let sumService = new SumBillingsService(billingsService)

  console.log(sumService.getTaskInMonth('TDACC-571', moment('2022-08-10', 'YYYY-MM-DD')).duration().as('hours'))

}