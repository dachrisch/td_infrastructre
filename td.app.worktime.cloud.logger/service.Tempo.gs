class TempoWorklogsService extends Entity {
  /**
   * @param {JiraIssueService} jiraIssueService
   * @param {JiraMyselfService} jiraMyselfService
   */
  constructor(jiraIssueService, jiraMyselfService) {
    super()
    let endpoint = "https://api.tempo.io/4/worklogs"
    this.worklogApi = api.createBearer(endpoint, PropertiesService.getScriptProperties().getProperty('tempoToken'))
    this.jiraIssueService = jiraIssueService
    this.jiraMyselfService = jiraMyselfService
    //api.log.setLevel(logger.Level.FINE)

  }

  /**
   * @param {EventWrapper} eventWrapper
   * 
   */
  hasNoBooking(event) {
    log.finest(`check ${event} has no booking`)
    return this.bookingForEvent(event).length == 0
  }

  /**
   * @param {EventWrapper} eventWrapper
   * 
   */
  bookingForEvent(event) {
    log.fine(`get bookings for ${event}`)
    let issueId = this.jiraIssueService.getIssue(event.bookingInfo.issueKey).id
    let results = this.worklogApi.on('search').post({
      from: event.startMoment.format("YYYY-MM-DD"),
      to: event.endMoment.format("YYYY-MM-DD"),
      issueIds: [issueId],
      authorIds: [this.jiraMyselfService.getMyself().accountId]
    }).results
    log.finest(`found ${results.length} bookings on day of event`)
    let matchingBooking = results.filter((result) => {
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
}
