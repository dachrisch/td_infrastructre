const BillingsService = class BillingsService {
  constructor(tempoApiConnector, identityService) {
    this.tempoApiConnector = tempoApiConnector
    this.identityService = identityService
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

  postAndMapToBilling(payload) {
    return this.tempoApiConnector.post(payload).map(Billing.fromJson)
  }
}

const AllCurrentUserBillingsService = class AllCurrentUserBillingsService extends BillingsService {
  static connect(authToken) {
    return new AllCurrentUserBillingsService(
      new ApiConnector('https://jira.tdservice.cloud/rest/tempo-timesheets/4/worklogs/search', authToken),
      MyIdentityService.connect(authToken))
  }

  getInRange(fromDate, toDate) {
    let payload = {
      from: moment(fromDate).format('YYYY-MM-DD'),
      to: moment(toDate).format('YYYY-MM-DD'),
      worker: [
        this.identityService.workerKey()
      ]
    }
    return this.postAndMapToBilling(payload)
  }
}

const SingleTaskOtherUserBillingsService = class SingleTaskOtherUserBillingsService extends BillingsService {
  static connect(authToken, userEmail) {
    return new SingleTaskOtherUserBillingsService(
      new ApiConnector('https://jira.tdservice.cloud/rest/tempo-timesheets/4/worklogs/search', authToken),
      OtherIdentityService.connect(authToken, userEmail))
  }

  getInRangeForTask(fromDate, toDate, taskKey) {
    let payload = {
      from: moment(fromDate).format('YYYY-MM-DD'),
      to: moment(toDate).format('YYYY-MM-DD'),
      worker: [this.identityService.workerKey()],
      taskKey: [taskKey]
    }
    return this.postAndMapToBilling(payload)
  }
}
