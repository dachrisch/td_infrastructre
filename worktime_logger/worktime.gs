function exportWorktime() {
  let momentFrom = moment('01.06.2022', 'DD.MM.YYYY')
  let momentTo = moment().clone().endOf('year')
  let s = sw.SpreadsheetWrapper.fromUrl('https://docs.google.com/spreadsheets/d/1ae8rBKkToILwSU64vXH94RYe-iXkvquMXvY13ApJw9c/')
  let now = moment()

  UrlFetchApp.fetch(`https://cronitor.link/p/e785985352b14396982fa07f4ec0afb3/hJICeq?state=run&series=export_worktime_${now}`)

  let workedDays = retrieveWorkday(momentFrom, momentTo)
  s.getSheet('worktimes').clear()
    .on('A1:B1').setHeader('Date', 'Hours').and()
    .on('A2:B').setValuesVariableLength(workedDays)

  let vacations = retrieveVacations(momentFrom, momentTo)
  s.getSheet('vacation').clear()
    .on('A1:D1').setHeader('Date', 'Is working day?', 'Is not public holiday?', 'Is bookable vacation day?').and()
    .on('A2:A').setValuesVariableLength(vacations.map((e) => [e.format('DD.MM.YYYY')])).and()
    .on('B2').setFormula('=arrayformula(not(not((weekday(vacation!A2:A;2)>0)*(weekday(A2:A;2)<5))))').and()
    .on('C2').setFormula('=arrayformula(not(COUNTIF(feiertage!A:A;A2:A)))').and()
    .on('D2').setFormula('=arrayformula(B2:B*C2:C)')

  /*
  let holidays = retrieveHolidays(momentFrom, momentTo)
  s.getSheet('feiertage')
    .on('A1:B1').setHeader('Date', 'Public Holiday').and()
    .on('A2:B').setValuesVariableLength(holidays)
*/

  s.getSheet('overview').clear()
    .on('A1:E1').setHeader('Month', 'Expected', 'worked', 'vacation', 'result').and()
    .on('B2').setFormula('=arrayformula(if($A$2:A;NETWORKDAYS.INTL($A2:A;EOMONTH($A2:A;0);"0000111";feiertage!$A$2:$A)*8;""))').and()
    .on('E2').setFormula('=arrayformula(if(C2:C;(C2:C+D2:D)-B2:B;""))').and()
    .on('E2:E13').when().aboveEqual(0).background('lightgreen').build().when().below(0).background('orange').build().and()
    .on('G4').setHeader('overtime').and().on('H4').setFormula('=sum(E2:E13)').when().aboveEqual(0).background('lightgreen').build().when().below(0).background('orange').build()

  let a = [...Array(12).keys()]
  a.forEach(m => {
    let col = m + 2
    s.getSheet('overview').on(`A${col}`).setValues(moment({ years: '2022', months: m, date: 1 }).format('DD.MM.YYYY')).and()
      .on(`C${col}`).setFormula(`=SUMIFs(worktimes!B:B;worktimes!A:A;">="&$A${col};worktimes!A:A;"<="&EOMONTH($A${col};0))`).and()
      .on(`D${col}`).setFormula(`=countIFs(vacation!A:A;">="&$A${col};vacation!A:A;"<="&EOMONTH($A${col};0);vacation!D:D;"=1")*8`).and()
  })

  UrlFetchApp.fetch(`https://cronitor.link/p/e785985352b14396982fa07f4ec0afb3/hJICeq?state=complete&series=export_worktime_${now}&metric=count:${workedDays.length}`)
}

function retrieveWorkday(momentFrom, momentTo) {

  return [...getCalendarByName('worktimes').getEvents(new Date(momentFrom), new Date(momentTo))
    .map(event => worklog.fromEvent(event))
    .reduce(
      (m, e) => {
        let date = e.start_date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
        let duration = (e.end_date - e.start_date) / (1000 * 60 * 60)
        m.set(date, (m.get(date) || 0) + duration)
        return m
      }, new Map())];
}

function retrieveVacations(momentFrom, momentTo) {
  return getCalendarByName('c.daehn@techdivision.com').getEvents(new Date(momentFrom), new Date(momentTo))
    .map(event => worklog.fromEvent(event))
    .filter((w) => w.summary == 'Urlaub')
    .reduce((vacationDays, current) => {
      let day = moment(current.start_date)
      while (day.isBefore(current.end_date)) {
        vacationDays.push(day.clone())
        day.add(1, 'd')
      }
      return vacationDays
    }, new Array())
}

function retrieveHolidays(momentFrom, momentTo) {
  return CalendarApp.getCalendarsByName('Feiertage in Deutschland')[0].getEvents(new Date(momentFrom), new Date(momentTo)).map((e) => [moment(e.getStartTime()).format('DD.MM.YYYY'), e.getTitle()])
}

function test() {
  let spreadsheet = sw.SpreadsheetWrapper.fromUrl('https://docs.google.com/spreadsheets/d/1ae8rBKkToILwSU64vXH94RYe-iXkvquMXvY13ApJw9c/')
  let sheet = spreadsheet.getSheet('feiertage')
  let range_a = sheet.on('A1:B1')
  range_a.setHeader('Date', 'Public Holiday').and()
    .on('A2:B').setValues(retrieveHolidays(momentFrom, momentTo))
}