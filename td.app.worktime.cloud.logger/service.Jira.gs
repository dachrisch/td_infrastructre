class JiraService extends Entity {
  constructor(part) {
    super()
    let username = 'c.daehn@techdivision.com'
    let endpoint = "https://techdivision.atlassian.net/rest/api/3/"
    this.jiraApi = api.createBasic(endpoint, username, PropertiesService.getScriptProperties().getProperty('jiraToken')).on(part)
  }
}

class JiraMyselfService extends JiraService {
  constructor() {
    super('myself')
  }

  getMyself() {
    return this.jiraApi.fetch()
  }
}

class JiraIssueService extends JiraService {
  constructor() {
    super('issue')
    //api.log.setLevel(logger.Level.FINE)
  }

  getIssue(issueKey) {
    return this.jiraApi.on(issueKey).fetch()
  }

  /**
   * @param {EventWrapper} eventWrapper
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
