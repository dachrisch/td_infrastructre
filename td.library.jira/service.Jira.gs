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
    this.m = null
  }

  getMyself() {
    if (!this.m) {
      this.m = this.jiraApi.fetch()
    }
    return this.m
  }
}

var JiraIssueService = class JiraIssueService extends JiraService {
  /**
   * @param {ApiConnector} jiraApi
   * @see @link https://script.google.com/home/projects/1TN1IOkW4-cvQfrmcqedSaQblG-ekjeB7-ghmpIfdp_R0N6I6cBHDH9H-
   */
  constructor(jiraApi) {
    super(jiraApi.on('issue'))
    this.i = {}
  }

  getIssue(issueKey) {
    if (!(issueKey in this.i)) {
      this.i[issueKey] = this.jiraApi.on(issueKey).fetch()
    }
    return this.i[issueKey]
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

var JiraIssuePickerService = class JiraIssuePickerService extends JiraService {
  /**
   * @param {ApiConnector} jiraApi
   * @see @link https://script.google.com/home/projects/1TN1IOkW4-cvQfrmcqedSaQblG-ekjeB7-ghmpIfdp_R0N6I6cBHDH9H-
   */
  constructor(jiraApi) {
    super(jiraApi.on('issue').on('picker'))
    //api.log.setLevel(logger.Level.FINE)
  }

  workOnIssues(query) {
    let params = {
      'currentJQL': 'project in projectsWhereUserHasPermission("Work on issues")',
      'query': query,
      'showSubTaskParent': true,
      'showSubTasks': true
    }
    return this.jiraApi.fetchWithParams(params)
  }
}

