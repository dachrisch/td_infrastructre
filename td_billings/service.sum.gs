const SummableBillings = class SummableBillings {
  /**
   * @param {Array.<Billing>} billings
   */
  constructor(billings) {
    this.billings = billings
  }

  /**
   * @return {number} - sum of duration of all billungs
   */
  duration() {
    return this.billings.reduce((sum, billing) => sum.add(billing.duration()), moment.duration())
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}

const SumBillingsService = class SumBillingsService {
  /**
   * @param {BillingsService} billingsService
   */
  constructor(billingsService) {
    this.billingsService = billingsService
  }

  /**
   * @param {String} taskKey - Tempo key of billings to get, e.g. TDACC-123
   * @param {moment} momentInMonth - some moment in month to get issues
   * @return {SummableBillings} 
   */
  getTaskInMonth(taskKey, momentInMonth) {
    return new SummableBillings(this.billingsService.getInRangeForTask(momentInMonth.clone().startOf('month'), momentInMonth.clone().endOf('month'), taskKey))
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}