class JiraService extends Service {
  constructor(jiraApi, part) {
    super()
    this.jiraApi = jiraApi.on(part)
  }
}

var JiraMyselfService = class JiraMyselfService extends JiraService {
  constructor(jiraApi) {
    super(jiraApi, 'myself')
  }

  getMyself() {
    return this.jiraApi.fetch()
  }
}

var JiraIssueService = class JiraIssueService extends JiraService {
  constructor(jiraApi) {
    super(jiraApi, 'issue')
    //api.log.setLevel(logger.Level.FINE)
  }

  getIssue(issueKey) {
    return this.jiraApi.on(issueKey).fetch()
  }

  /**
   * @param {EventWrapper} event
   * @returns {Boolean} if event has a valid event.bookingInfo.issueKey
   * 
   */
  hasValidKey(event) {
    log.finest(`check ${event} has valid key`)
    let result = false
    try {
      result = this.getIssue(event.bookingInfo.issueKey) != undefined
    } catch (e) {
      if (e instanceof api.HttpError && e.responseCode == 404) {
        result = false
      } else {
        throw e
      }
    }
    log.finest(`found that ${event} has ${result ? '' : 'no '}valid key`)
    return result
  }
}
