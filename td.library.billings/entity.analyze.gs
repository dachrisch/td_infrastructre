class AnalyzableBillingsSheet {
  static get COLORS() {
    return Object.freeze({
      grey: '#cccccc',
      green: '#d9ead3',
      blue: '#cfe2f3',
      orange: '#fce5cd'
    })
  }
  constructor(spreadsheetWrapper, billingSheets) {
    this.spreadsheetWrapper = spreadsheetWrapper
    this.billingSheets = billingSheets
  }

  createForecast() {
    this.createForecastHistory()
    this.createForecastTrend()
    this.createForecastViews()
  }

  createForecastHistory() {
    let forecastHistorySheet = this.spreadsheetWrapper.createOrGetSheet('forecast history').protect().clear()
    let sheetQueries = this.billingSheets.map((sheet) => `query('${sheet}'!A:G;"select A,F,D,G";0)`)
    forecastHistorySheet
      .on('A1:D1').setHeader('date', 'duration', 'description', 'booking duration').and()
      .on('A2').setFormula(`sort({${sheetQueries.join(';')}})`).and()
      .on('A:A').setNamedRange('forecast.history.dates').and()
      .on('D:D').setNamedRange('forecast.history.durations').and()
      .on('A:E').setNamedRange('forecast.history.data').and()
  }


  createForecastTrend(months = 14) {
    let forecastTrendSheet = this.spreadsheetWrapper.createOrGetSheet('forecast trend').clear()

    this.createForecastTrendBaseData(forecastTrendSheet)
    this.createForecastTrendActualData(forecastTrendSheet)
    this.createForecastTrendData(forecastTrendSheet, months)
    this.createForecastTrendCompleteData(forecastTrendSheet)

  }

  createForecastTrendBaseData(forecastTrendSheet) {
    forecastTrendSheet
      .on('A1:B9').withBackground(AnalyzableBillingsSheet.COLORS.grey).and()
      .on('A1').setHeader('first of month').and().on('B1').setFormula('=forecast.month.last-forecast.month.days+1').setNamedRange('forecast.month.first').and()
      .on('A2').setHeader('last of month').and().on('B2').setFormula('=EOMONTH(now();0)').setNamedRange('forecast.month.last').and()
      .on('A3').setHeader('days in current month').and().on('B3').setFormula('=day(EOMONTH(now();0))').setNamedRange('forecast.month.days').and()
      .on('A4').setHeader('threshold date').and().on('B4').setFormula('=date(year(now());month(now());1)+forecast.threshhold*forecast.month.days').setNamedRange('forecast.threshhold.date').and()
      .on('A5').setHeader('above threshold').and().on('B5').setFormula('=now()>forecast.threshhold.date').setNamedRange('forecast.threshold.above').and()
      .on('A6').setHeader('actual data date').and().on('B6').setFormula('=if(forecast.threshold.above;now();forecast.month.first)').setNamedRange('forecast.data.date').and()
      .on('A7').setHeader('forecast monthly certainty offset').withBackground(AnalyzableBillingsSheet.COLORS.orange).and().on('B7').setValues('80%').withBackground(AnalyzableBillingsSheet.COLORS.orange).setNamedRange('forecast.certainty').and()
      .on('A8').setHeader('actual data vs. forecast threshold (%)').withBackground(AnalyzableBillingsSheet.COLORS.green).and().on('B8').setValues('60%').setNamedRange('forecast.threshhold').withBackground(AnalyzableBillingsSheet.COLORS.green).and()
      .on('A9').setHeader('Base Earning (€)').and().on('B9').setValues(200).setNamedRange('forecast.base.earning')

  }

  createForecastTrendActualData(forecastTrendSheet) {

    forecastTrendSheet
      .on('D1').setHeader('Actual (within threshold)').and()
      .on('D2').setFormula(`=QUERY(filter(forecast.history.data;forecast.history.dates <forecast.data.date);"select year(Col1), month(Col1)+1, sum(Col4) where Col1 is not NULL group by year(Col1), month(Col1) label year(Col1) 'year', month(Col1)+1 'month'")`).and()
      .on('D2:F2').asHeader().and()
      .on('D1:G2').withBackground(AnalyzableBillingsSheet.COLORS.grey).and()
      .on('D2:E2').withBackground(AnalyzableBillingsSheet.COLORS.green).and()
      .on('D3:D').setNamedRange('forecast.actual.years').and()
      .on('E3:E').setNamedRange('forecast.actual.months').and()
      .on('F3:F').setNamedRange('forecast.actual.sums').and()
      .on('G3:G').setNamedRange('forecast.actual.eomonths').and()
      .on('F3:G').setNamedRange('forecast.actual.sums_months').and()
      .on('G2').setHeader('End of Month').and().on('G3').setFormula('=ARRAYFORMULA(if(forecast.actual.years;EOMONTH(DATE(forecast.actual.years;forecast.actual.months;1);0);""))').and()
      .on('D3:G').when().aboveEqual(0).background(AnalyzableBillingsSheet.COLORS.grey).build()

  }

  createForecastTrendData(forecastTrendSheet, months = 14) {

    forecastTrendSheet
      .on(`I1:L${months + 2}`).withBackground(AnalyzableBillingsSheet.COLORS.grey).and()
      .on('I1').setHeader('Trend (actual in the past, forecast in the future)').and()
      .on('I2').setHeader('Relative month').and()
      .on(`I3:I${months + 2}`).setValuesVariableLength(Array.from(Array(months).keys()).map(item => [item])).setNamedRange('forecast.months.relative').withBackground(AnalyzableBillingsSheet.COLORS.blue)

    forecastTrendSheet
      .on('J2').setHeader('End of Month').withBackground(AnalyzableBillingsSheet.COLORS.blue).and()
      .on('J3').setFormula(`=ARRAYFORMULA(EOMONTH(forecast.month.last;forecast.months.relative))`).and()
      .on('K2').setHeader('Trend hours in Month').withBackground(AnalyzableBillingsSheet.COLORS.orange).and()
      .on('K3').setFormula(`=if(forecast.threshold.above;SUMIFS(forecast.history.durations;forecast.history.dates;">="&forecast.month.first;forecast.history.dates; "<="&forecast.month.last);AVERAGE(forecast.actual.sums))`).and()
      .on(`K3:K${months + 2}`).setNamedRange('forecast.trend.hours').and()
      .on('J3:J').setNamedRange('forecast.trend.eomonths').and()
      .on('K3:K').setNamedRange('forecast.trend.sums').and()
      .on('J3:K').setNamedRange('forecast.trend.eomonths_sums').and()

    Array.from(Array(months - 1).keys()).forEach(monthOffset => {
      forecastTrendSheet.on(`K${3 + monthOffset + 1}`).setFormula(`K${3 + monthOffset} * forecast.certainty`)
    })

    forecastTrendSheet
      .on('L2').setHeader('Earnings').withBackground(AnalyzableBillingsSheet.COLORS.orange).and()
      .on('L3').setFormula(`=ARRAYFORMULA(forecast.trend.hours*forecast.base.earning)`).and()
  }

  createForecastTrendCompleteData(forecastTrendSheet) {
    forecastTrendSheet
      .on('N1').setHeader('Complete data').and()
      .on('N2').setHeader('Month').and()
      .on('O2').setHeader('Total Hours').and()
      .on('N3').setFormula('={query(filter(forecast.actual.sums_months;ISNUMBER(forecast.actual.eomonths));"select Col2, Col1");filter(forecast.trend.eomonths_sums;ISNUMBER(forecast.trend.eomonths))}').and()
      .on('N1:O2').withBackground(AnalyzableBillingsSheet.COLORS.grey).and()
      .on('N3:O').when().aboveEqual(0).background(AnalyzableBillingsSheet.COLORS.grey).build().setNamedRange('forecast.comlete.data')
  }


  createForecastViews() {
    let forecastTrendView = this.spreadsheetWrapper.createOrGetSheet('forecast view').protect().clear()

    forecastTrendView
    .on('A1').setFormula(`=unique(query({forecast.comlete.data};"select year(Col1) label year(Col1) 'Year/Month'"))`).asHeader().and()
    .on('A2:A').asHeader().setNamedRange('forecast.view.years').and()
    .on('B1:M1').asHeader().setValues([Array.from(Array(12).keys()).map(i=>i+1)]).setNamedRange('forecast.view.months').and()
    .on('B2').setFormula(`=arrayformula(arrayformula(IFNA(VLOOKUP(EOMONTH(DATE(forecast.view.years;forecast.view.months;1);0);forecast.comlete.data;2;false)*forecast.base.earning)))`)
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}
