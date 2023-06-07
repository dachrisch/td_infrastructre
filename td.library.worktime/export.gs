var exportWorktime = function exportWorktime(momentFrom, momentTo, spreadsheet) {
  let s = spreadsheet
  let calendarRetriever = new CalendarRetrieverService(new cWrap.CalendarAppWrapper())
  let telemetry = t.Telemetry.forSeries('export_worktime')

  telemetry.start()

  let workedDays = calendarRetriever.retrieveWorkdays(momentFrom, momentTo)
  s.getSheet('worktimes').clear()
    .on('A1:B1').setHeader('Date', 'Hours').and()
    .on('A2:B').setValuesVariableLength(workedDays)
  telemetry.count(workedDays.length, `working days: ${workedDays.length}`)

  let vacations = calendarRetriever.retrieveVacations(momentFrom, momentTo)
  if (vacations.length > 0) {
    s.getSheet('vacation').clear()
      .on('A1:D1').setHeader('Date', 'Is working day?', 'Is not public holiday?', 'Is bookable vacation day?').and()
      .on('A2:A').setValuesVariableLength(vacations).and()
      .on('B2').setFormula('=arrayformula(not(not((weekday(vacation!A2:A;2)>0)*(weekday(A2:A;2)<5))))').and()
      .on('C2').setFormula('=arrayformula(not(COUNTIF(feiertage!D:D;A2:A)))').and()
      .on('D2').setFormula('=arrayformula(B2:B*C2:C)')
    telemetry.count(vacations.length, `vacations: ${vacations.length}`)
  }

  let holidays = calendarRetriever.retrieveHolidays(momentFrom, momentTo)
  s.getSheet('feiertage')
    .on('A1:C1').setHeader('Date', 'Public Holiday', 'Relevant?').and()
    .on('A2:B').setValuesVariableLength(holidays).and()
    .on('D2').setFormula('=ARRAYFORMULA(IF(C2:C;A2:A;))')
  telemetry.count(holidays.length, `holidays: ${holidays.length}`)


  s.getSheet('overview').clear()
    .on('A1:F1').setHeader('Month', 'Expected', 'worked', 'vacation', 'result', 'overtime').withBackground('#cccccc').and()
    .on('B2').setFormula('=arrayformula(if($A$2:A;NETWORKDAYS.INTL($A2:A;EOMONTH($A2:A;0);"0000111";feiertage!$D$2:$D)*8;))').and()
    .on('E2').setFormula('=arrayformula(if(C2:C;(C2:C+D2:D)-B2:B;""))').and()
    .on('E2:F').when().aboveEqual(0).background('lightgreen').build().when().below(0).background('orange').build().and()

  let index = 2
  for (var momentInMonth = momentFrom.clone(); momentInMonth.isBefore(momentTo); momentInMonth.add(1, 'month')) {
    s.getSheet('overview')
      .on(`A${index}`).setValues(momentInMonth.format('DD.MM.YYYY')).and()
      .on(`C${index}`).setFormula(`=SUMIFs(worktimes!B:B;worktimes!A:A;">="&$A${index};worktimes!A:A;"<="&EOMONTH($A${index};0))`).and()
      .on(`D${index}`).setFormula(`=countIFs(vacation!A:A;">="&$A${index};vacation!A:A;"<="&EOMONTH($A${index};0);vacation!D:D;"=1")*8`).and()
      .on(`F${index}`).setFormula('=sum(INDIRECT("E2:"&ADDRESS(row();5)))')
    index++
  }
  s.getSheet('overview')
    .on(`A2:A${index - 1}`).withBackground('#cccccc').and()
    .on(`B2:D${index - 1}`).withBackground('#d9d9d9')

  telemetry.end()
}
