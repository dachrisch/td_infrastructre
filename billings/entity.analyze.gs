class AnalyzableBillingsSheet {
  constructor(spreadsheetWrapper, billingSheets) {
    this.spreadsheetWrapper = spreadsheetWrapper
    this.billingSheets = billingSheets
  }

  createForecast() {
    this.createForecastData()
    this.createForecastTrend()
  }

  createForecastData() {
    let forecastDataSheet = this.spreadsheetWrapper.createOrGetSheet('forecast data').clear()
    let sheetQueries = this.billingSheets.map((sheet) => `query('${sheet}'!A:G;"select A,F,D,G";0)`)
    forecastDataSheet
    .on('A1:D1').setHeader('date', 'duration', 'description', 'booking duration').and()
    .on('A2').setFormula(`sort({${sheetQueries.join(';')}})`)
  }


  createForecastTrend() {
    let forecastTrendSheet = this.spreadsheetWrapper.createOrGetSheet('forecast trend').clear()
    forecastTrendSheet
    .on('A1').setHeader('first of month').and().on('B1').setFormula('=forecast.month.end-forecast.month.days+1').and()
    .on('A2').setHeader('last of month').and().on('B2').setFormula('=EOMONTH(now();0)').setNamedRange('forecast.month.end').and()
    .on('A3').setHeader('days in current month').and().on('B3').setFormula('=day(EOMONTH(now();0))').setNamedRange('forecast.month.days').and()
    .on('A4').setHeader('threashold date').and().on('B4').setFormula('=date(year(now());month(now());1)+forecast.threshhold*forecast.month.days').and()
    .on('A8').setHeader('actual data vs. forecast threshold (%)').withBackground('lightgreen').and().on('B8').setValues('60%').setNamedRange('forecast.threshhold').withBackground('lightgreen')
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}