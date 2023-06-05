class JiraService extends Service {
  /**
   * @param {ApiConnector} jiraApi
   * @see @link https://script.google.com/home/projects/1TN1IOkW4-cvQfrmcqedSaQblG-ekjeB7-ghmpIfdp_R0N6I6cBHDH9H-
   */
  constructor(jiraApi) {
    super()
    this.jiraApi = jiraApi
  }
}

var JiraMyselfService = class JiraMyselfService extends JiraService {
  /**
   * @param {ApiConnector} jiraApi
   * @see @link https://script.google.com/home/projects/1TN1IOkW4-cvQfrmcqedSaQblG-ekjeB7-ghmpIfdp_R0N6I6cBHDH9H-
   */
  constructor(jiraApi) {
    super(jiraApi.on('myself'))
  }

  getMyself() {
    return this.jiraApi.fetch()
  }
}

var JiraIssueService = class JiraIssueService extends JiraService {
  /**
   * @param {ApiConnector} jiraApi
   * @see @link https://script.google.com/home/projects/1TN1IOkW4-cvQfrmcqedSaQblG-ekjeB7-ghmpIfdp_R0N6I6cBHDH9H-
   */
  constructor(jiraApi) {
    super(jiraApi.on('issue'))
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
