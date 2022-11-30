const Billing = class Billing {
  static fromJson(json) {
    let fromDate = moment(json.started)
    let toDate = fromDate.clone().add(json.timeSpentSeconds, 'seconds')
    return new Billing(fromDate, toDate, json.comment, json.billableSeconds, json.issue.key)
  }

  constructor(fromDate, toDate, description, billableSeconds, billingKey) {
    this.fromDate = fromDate
    this.toDate = toDate
    this.description = description
    this.billableSeconds = billableSeconds
    this.billingKey = billingKey
  }

  quarter() {
    return `${this.fromDate.year()}/${this.fromDate.quarter()}`
  }

  duration() {
    return moment.duration(this.toDate.diff(this.fromDate))
  }

  billableDuration() {
    return moment.duration(this.billableSeconds, 'seconds')
  }
}

class ExportableBillings {
  constructor(billings) {
    this.billingsByQuarter = new Map()
    billings.forEach((billing) => {
      if (!(this.billingsByQuarter.has(billing.quarter()))) {
        this.billingsByQuarter.set(billing.quarter(), [])
      }
      this.billingsByQuarter.get(billing.quarter()).push(billing)
    })
  }

  toSheet(spreadsheetWrapper) {

    this.billingsByQuarter.forEach((billings, quarter) => {
      let quarterSheet = spreadsheetWrapper.createOrGetSheet(quarter).clear()
      quarterSheet
        .on('A1:G1').setHeader('Date', 'From', 'To', 'Description', 'Booking Factor', 'Duration', 'Booking duration').and()
        .on('A:G').appendValues(billings.map((billing) => [
          billing.fromDate.format('DD.MM.YYYY'),
          billing.fromDate.format('HH:mm'),
          billing.toDate.format('HH:mm'),
          billing.description,
          ,
          billing.duration().as('hours'),
          billing.billableDuration().as('hours')
        ]))
    })
    return this.analyzable(spreadsheetWrapper)
  }

  analyzable(spreadsheetWrapper) {
    return new AnalyzableBillingsSheet(spreadsheetWrapper, Array.from(this.billingsByQuarter.keys()))
  }
}

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
}
