var ExportBillingsService = class ExportBillingsService {
  constructor(billingsService) {
    this.billingsService = billingsService
  }

  exportQuarter(momentInQuarter) {
    return new ExportableBillings(this.billingsService.bookingsInTimerange(momentInQuarter.clone().startOf('quarter'), momentInQuarter.clone().endOf('quarter')).map(Billing.fromJson))
  }

  exportYear(momentInYear) {
    return new ExportableBillings(this.billingsService.bookingsInTimerange(momentInYear.clone().startOf('year'), momentInYear.clone().endOf('year')).map(Billing.fromJson))
  }

  exportUntil(momentFrom, momentUntil){
    return new ExportableBillings(this.billingsService.bookingsInTimerange(momentFrom, momentUntil, 1000).map(Billing.fromJson))
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}
