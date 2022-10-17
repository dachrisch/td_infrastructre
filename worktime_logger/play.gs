
function play_export_billings_last_quarter() {
  let spreadsheet_url = get_spreadsheet_url()
  let now = moment("01.09.2022","DD.MM.YYYY")
  let billings = main_calendar_billings_in_quarter(now)
  let message = `exporting [${billings.length}] billings in quarter [${now.year()}/${now.quarter()}] to [${spreadsheet_url}]`
  console.info(message)
  UrlFetchApp.fetch(`https://cronitor.link/p/e785985352b14396982fa07f4ec0afb3/hJICeq?state=run&series=export_billings_${now}`)
  if (billings.length > 0) {
    export_billings(spreadsheet_url, billings)
  }
  UrlFetchApp.fetch(`https://cronitor.link/p/e785985352b14396982fa07f4ec0afb3/hJICeq?state=complete&series=export_billings_${now}&metric=count:${billings.length}&message=${message}`)
}
