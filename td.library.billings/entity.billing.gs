const Billing = class Billing {
  static fromJson(json) {
    let fromDate = moment(`${json.startDate} ${json.startTime}`, 'YYYY-MM-DD HH:mm:ss')
    let toDate = fromDate.clone().add(json.timeSpentSeconds, 'seconds')
    return new Billing(fromDate, toDate, json.description, json.billableSeconds)
  }

  constructor(fromDate, toDate, description, billableSeconds) {
    this.fromDate = fromDate
    this.toDate = toDate
    this.description = description
    this.billableSeconds = billableSeconds
  }

  quarter() {
    return `${this.fromDate.year()}/${this.fromDate.quarter()}`
  }

  duration() {
    assert(this.toDate instanceof moment)
    assert(this.fromDate instanceof moment)

    return moment.duration(this.toDate.diff(this.fromDate))
  }

  billableDuration() {
    return moment.duration(this.billableSeconds, 'seconds')
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }
}

