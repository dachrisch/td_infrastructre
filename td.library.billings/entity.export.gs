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
      let quarterSheet = spreadsheetWrapper.createOrGetSheet(quarter).protect().clear()
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

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}
