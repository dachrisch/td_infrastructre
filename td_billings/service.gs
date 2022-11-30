if ((typeof moment) === 'undefined') {
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js').getContentText());
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.34/moment-timezone-with-data.min.js').getContentText());
}

const IdentityService = class IdentityService {
  static connect(authToken) {
    return new IdentityService(new ApiConnector('https://jira.tdservice.cloud/rest/api/2/myself', authToken))
  }
  constructor(identityApiConnector) {
    this.identityApiConnector = identityApiConnector
    console.log(`${this}`)
  }
  workerKey() {
    return this.identityApiConnector.fetch().key
  }

  toString() {
    return `${this.constructor.name}(identityApiConnector=${this.identityApiConnector})`
  }
}

const BillingsService = class BillingsService {
  static connect(authToken) {
    return new BillingsService(
      new ApiConnector('https://jira.tdservice.cloud/rest/tempo-timesheets/4/worklogs/search', authToken),
      IdentityService.connect(authToken))
  }
  constructor(tempoApiConnector, identityService) {
    this.tempoApiConnector = tempoApiConnector
    this.identityService = identityService
    console.log(`${this}`)
  }
  getInRange(from_date, to_date) {
    let payload = {
      from: moment(from_date).format('YYYY-MM-DD'),
      to: moment(to_date).format('YYYY-MM-DD'),
      worker: [
        this.identityService.workerKey()
      ]
    }
    return this.tempoApiConnector.post(payload).map(Billing.fromJson)
  }

  toString() {
    return `${this.constructor.name}(tempoApiConnector=${this.tempoApiConnector}, identityService=${this.identityService})`
  }
}

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
}
