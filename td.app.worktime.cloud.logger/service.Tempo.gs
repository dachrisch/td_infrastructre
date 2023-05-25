class TempoWorklogsService extends Entity {
  /**
   * @param {JiraIssueService} jiraIssueService
   * @param {JiraMyselfService} jiraMyselfService
   */
  constructor(jiraIssueService, jiraMyselfService) {
    super()
    if (globalTest) {
      this.worklogApi = api.createBearer(scriptProperty('tempoEndpoint'), scriptProperty('tempoTestToken'))
    } else {
      this.worklogApi = api.createBearer(scriptProperty('tempoEndpoint'), scriptProperty('tempoToken'))
    }
    this.jiraIssueService = jiraIssueService
    this.jiraMyselfService = jiraMyselfService
    //api.log.setLevel(logger.Level.FINE)

  }

  /**
   * @param {EventWrapper} event
   * 
   */
  hasNoBooking(event) {
    log.finest(`check ${event} has no booking`)
    return this.bookingsForEvent(event).length == 0
  }

  _myAccount() {
    return this.jiraMyselfService.getMyself().accountId
  }

  _issueIdFor(event) {
    return this.jiraIssueService.getIssue(event.bookingInfo.issueKey).id
  }

  /**
   * @param {EventWrapper} event
   * 
   */
  bookingsForEvent(event) {
    log.fine(`get bookings for ${event}`)
    let eventsOnDay = this.worklogApi.on('search').post({
      from: event.startMoment.format("YYYY-MM-DD"),
      to: event.endMoment.format("YYYY-MM-DD"),
      issueIds: [this._issueIdFor(event)],
      authorIds: [this._myAccount()]
    }).results
    log.finest(`found ${eventsOnDay.length} bookings on day of event`)
    let matchingBooking = eventsOnDay.filter((result) => {
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
   * @param {EventWrapper} event
   * @link https://apidocs.tempo.io/#tag/Worklogs/operation/createWorklog
   * @returns {String} link to created instance
   */
  book(event) {
    log.info(`booking ${event}`)
    let payload = {
      authorAccountId: this._myAccount(),
      issueId: this._issueIdFor(event),
      description: event.title,
      startDate: event.startMoment.format("YYYY-MM-DD"),
      startTime: event.startMoment.format("HH:mm:ss"),
      timeSpentSeconds: event.duration().as('seconds'),
    }
    if (event.bookingInfo.billable) {
      payload['billableSeconds'] = event.billingDuration()
    }
    log.fine(`booking ${event} with payload ${payload}`)
    let result = this.worklogApi.post(payload)
    log.fine(`result: ${JSON.stringify(result)}`)
    return result.self
  }

}
