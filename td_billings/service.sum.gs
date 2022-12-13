const SummableBillings = class SummableBillings {
  constructor(billings) {
    this.billings = billings
  }

  duration() {
    return this.billings.reduce((sum, billing) => sum.add(billing.duration()), moment.duration())
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}

const SumBillingsService = class SumBillingsService {
  constructor(billingsService) {
    this.billingsService = billingsService
  }

  getTaskInMonth(taskKey, momentInMonth) {
    return new SummableBillings(this.billingsService.getInRangeForTask(momentInMonth.clone().startOf('month'), momentInMonth.clone().endOf('month'), taskKey))
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}