class TempoService extends Service {
  /**
   * @param {ApiConnector} tempoApi
   * @see @link https://script.google.com/home/projects/1TN1IOkW4-cvQfrmcqedSaQblG-ekjeB7-ghmpIfdp_R0N6I6cBHDH9H-
   */
  constructor(tempoApi) {
    super()
    this.tempoApi = tempoApi
  }

}

var TempoWorklogSearchService = class TempoWorklogSearchService extends TempoService {
  /**
   * @param {ApiConnector} tempoApi
   * @param {ApiConnector} jiraApi
   * @see @link https://script.google.com/home/projects/1TN1IOkW4-cvQfrmcqedSaQblG-ekjeB7-ghmpIfdp_R0N6I6cBHDH9H-
   */
  constructor(tempoApi, jiraApi) {
    super(tempoApi.on('worklogs/search'))
    this.jiraIssueService = new JiraIssueService(jiraApi)
    this.jiraMyselfService = new JiraMyselfService(jiraApi)
  }

  /**
   * @param {EventWrapper} event
   * 
   */
  hasNoBooking(event) {
    log.finest(`check ${event} has no booking`)
    return this.bookingsForEvent(event).length == 0
  }

  /**
   * @param {EventWrapper} event
   * 
   */
  bookingsForEvent(event) {
    log.fine(`get bookings for ${event}`)
    let bookingsOnDay = this.tempoApi.post({
      from: event.startMoment.format("YYYY-MM-DD"),
      to: event.endMoment.format("YYYY-MM-DD"),
      issueIds: [this.jiraIssueService.getIssue(event.bookingInfo.issueKey).id],
      authorIds: [this.jiraMyselfService.getMyself().accountId]
    }).results
    log.finest(`found ${bookingsOnDay.length} bookings on day of event`)
    let matchingBooking = bookingsOnDay.filter((result) => {
      let matchingTitle = result.description == event.title
      log.finest(`${result.description} == ${event.title}`)
      let matchingStart = result.startTime == event.startMoment.format("HH:mm:ss")
      log.finest(`${result.startTime} == ${event.startMoment.format("HH:mm:ss")}`)
      let matchingEnd = result.timeSpentSeconds == event.duration().as('seconds')
      log.finest(`${result.timeSpentSeconds} == ${event.duration().as('seconds')}`)
      return matchingTitle && matchingStart && matchingEnd
    })
    log.fine(`found ${matchingBooking.length} bookings for ${event}: ${JSON.stringify(matchingBooking)}`)
    return matchingBooking
  }

  /**
   * @param {moment} startMoment
   * @param {moment} endMoment
   */
  bookingsInTimerange(startMoment, endMoment) {
    log.info(`get bookings from ${startMoment} to ${endMoment}`)
    let bookingsInRange = this.unpagedSearch(startMoment.format("YYYY-MM-DD"),
      endMoment.format("YYYY-MM-DD"),
      [this.jiraMyselfService.getMyself().accountId]
    )

    log.fine(`found ${bookingsInRange.length} bookings on day of event`)
    return bookingsInRange
  }

  unpagedSearch(_from, _to, authorIds, offset = 0, limit = 50) {
    let complete = []
    log.finest(`searching page [${offset}, ${offset + limit}]`)
    let bookingSearch = this.tempoApi.withParams({
      offset: offset,
      limit: limit
    }).post({
      from: _from,
      to: _to,
      authorIds: authorIds
    })
    complete.push(...bookingSearch.results)
    if ('next' in bookingSearch.metadata) {
      complete.push(...this.unpagedSearch(_from, _to, authorIds, offset + limit, limit))
    }
    return complete
  }
}

class TempoAccountsService extends TempoService {
  constructor(tempoApi) {
    super(tempoApi.on('accounts'))
    this.a = {}
  }

  fromFields(fields) {
    let accountFieldId = fields[TempoAccountsService.accountField].id
    if (!(accountFieldId in this.a)) {
      this.a[accountFieldId] = this.tempoApi.on(accountFieldId).fetch()
    }
    return this.a[accountFieldId]
  }
}

TempoAccountsService.accountField = 'io.tempo.jira__account'

var TempoWorklogBookService = class TempoWorklogBookService extends TempoService {
  constructor(tempoApi, jiraApi) {
    super(tempoApi.on('worklogs'))
    this.jiraIssueService = new JiraIssueService(jiraApi)
    this.jiraMyselfService = new JiraMyselfService(jiraApi)
    this.tempoAccountService = new TempoAccountsService(tempoApi)
  }

  /**
   * @param {EventWrapper} event
   * @link https://apidocs.tempo.io/#tag/Worklogs/operation/createWorklog
   * @returns {String} link to created instance
   */
  book(event) {
    log.info(`booking ${event}`)
    let issue = this.jiraIssueService.getIssue(event.bookingInfo.issueKey, [TempoAccountsService.accountField])
    let payload = {
      authorAccountId: this.jiraMyselfService.getMyself().accountId,
      issueId: issue.id,
      description: event.title,
      startDate: event.startMoment.format("YYYY-MM-DD"),
      startTime: event.startMoment.format("HH:mm:ss"),
      timeSpentSeconds: event.duration().as('seconds'),
      billableSeconds: 0,
      attributes: []
    }
    if (event.bookingInfo.billable) {
      payload.billableSeconds = event.billingDuration()
    } else {
      payload.attributes.push({ key: '_NotBillable_', value: true })
    }
    if (issue.fields[TempoAccountsService.accountField] && 'value' in issue.fields[TempoAccountsService.accountField]) {
      // assign default account to issue
      let accountKey = this.tempoAccountService.fromFields(issue.fields).key
      payload.attributes.push({ key: '_Account_', value: accountKey })
    }
    log.fine(`booking ${event} with payload ${payload}`)
    let result = this.tempoApi.post(payload)
    log.fine(`result: ${JSON.stringify(result)}`)
    return result
  }

}

var TempoWorklogDeleteService = class TempoWorklogBookService extends TempoService {
  constructor(tempoApi) {
    super(tempoApi.on('worklogs'))
  }

  delete(worklogId) {
    log.info(`removing worklog with id ${worklogId}`)
    this.tempoApi.on(worklogId).remove()
  }
}
