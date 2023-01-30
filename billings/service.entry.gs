const SummableBillingsService = class SummableBillingsService {
  static connect(tempoToken, userEmail) {
    let billingsService = SingleTaskOtherUserBillingsService.connect(tempoToken, userEmail)
    return new SummableBillingsService(billingsService)
  }

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
  getTasksInDay(taskKey, momentInDay, comment) {
    let billingsInDay = this.billingsService.getInRangeForTask(momentInDay.clone().startOf('day'), momentInDay.clone().endOf('day'), taskKey)
    return new SummableBillings(billingsInDay.filter(b => b.description == comment))
  }

  /**
   * @param {String} taskKey - Tempo key of billings to get, e.g. TDACC-123
   * @param {moment} momentInMonth - some moment in month to get issues
   * @return {SummableBillings} 
   */
  getTasksInMonth(taskKey, momentInMonth) {
    return new SummableBillings(this.billingsService.getInRangeForTask(momentInMonth.clone().startOf('month'), momentInMonth.clone().endOf('month'), taskKey))
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }
}
