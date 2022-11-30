
function test() {
  let billingsService = BillingsService.connect('NTc2MDgyMTA1MjgzOpkPV0qVEijWuNpXRwI9XYbt9586')
  let exportService = new ExportBillingsService(billingsService)
  let spreadsheet = sw.SpreadsheetWrapper.fromUrl('https://docs.google.com/spreadsheets/d/11Z9L9FhiRLD-KuOrYsMdSumAIoEApu3Cgm_1I7a3bRA/edit#gid=0')

  exportService.exportYear(moment('2022-11-01')).analyzable(spreadsheet).createForecast()
  
}
