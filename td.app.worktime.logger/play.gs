
function play_export_billings_last_quarter() {
  let spreadsheet_url = get_spreadsheet_url()
  let now = moment("01.09.2022", "DD.MM.YYYY")
  let billings = main_calendar_billings_in_quarter(now)
  let message = `exporting [${billings.length}] billings in quarter [${now.year()}/${now.quarter()}] to [${spreadsheet_url}]`
  console.info(message)
  UrlFetchApp.fetch(`https://cronitor.link/p/e785985352b14396982fa07f4ec0afb3/hJICeq?state=run&series=export_billings_${now}`)
  if (billings.length > 0) {
    export_billings(spreadsheet_url, billings)
  }
  UrlFetchApp.fetch(`https://cronitor.link/p/e785985352b14396982fa07f4ec0afb3/hJICeq?state=complete&series=export_billings_${now}&metric=count:${billings.length}&message=${message}`)
}

function get_token() {
  console.log(tempo_token())
}

function play_remove_non_working_events() {
  let from_date = moment()
  let to_date = moment().endOf('year')
  let userCalendar = getCalendarByName(Session.getActiveUser().getEmail())
  let events = userCalendar.getEvents(from_date.toDate(), to_date.toDate())

  let fridays = events.filter(e => [0, 5, 6].includes(e.getStartTime().getDay())).filter(e => !['frei', 'Urlaub'].includes(e.getTitle()))
  console.log(`about to detele ${fridays.length} friday events`)
  fridays.forEach(f => {
    console.log(`removing ${f.getStartTime().toISOString()}, ${f.getTitle()}`)
    f.deleteEvent()
  })
}

function play_getAccount() {
  console.log(issueId('ACCBILLMON-1'))
  console.log(issueAccount('ACCBILLMON-1'))
}