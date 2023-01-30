const ExportBillingsService = class ExportBillingsService {
  constructor(billingsService) {
    this.billingsService = billingsService
  }

  exportQuarter(momentInQuarter) {
    return new ExportableBillings(this.billingsService.getInRange(momentInQuarter.clone().startOf('quarter'), momentInQuarter.clone().endOf('quarter')))
  }

  exportYear(momentInYear) {
    return new ExportableBillings(this.billingsService.getInRange(momentInYear.clone().startOf('year'), momentInYear.clone().endOf('year')))
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}
