var JiraService = class JiraService extends Service {
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
    this._cache = new Cache()
  }

  getMyself() {
    if (!this._cache.has('myself')) {
      this._cache.set('myself', this.jiraApi.fetch())
    }
    return this._cache.get('myself')
  }
}
