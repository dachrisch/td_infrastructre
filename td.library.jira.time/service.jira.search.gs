function importUnderscore() {
  if ((typeof _) === 'undefined') {
    eval(UrlFetchApp.fetch('https://cdn.jsdelivr.net/npm/underscore@1.13.6/underscore-umd-min.js').getContentText());
    _.memoize()
  }
}

var JiraIssueStatusChangeSearchService = class JiraIssueStatusChangeSearchService extends jira.JiraSearchService {
  constructor(jiraApi) {
    super(jiraApi)
    importUnderscore()
  }

  extractFieldKeys(keys) {
    return keys.map(k => k.split('.')).filter(k => k[0] === 'fields').map(k => k[1])
  }

  /**
   * find time spent for issues in timeframe
   * @param fromMoment {moment}
   * @param toMoment {moment}
   * @param projects {Array.<string>}
   * @param toStatus {string}
   * @param types {string | Array.<string>}
   * @param keys {Array.<string>}
   */
  issuesWithStatusChangeInTimeframe(fromMoment, toMoment, projects, toStatus, types, keys) {
    log.info(`searching for issues in [${projects}] with status change to [${toStatus}] during [${fromMoment.format('YYYY-MM-DD')}, ${toMoment.format('YYYY-MM-DD')}]`)
    let query = `project in (${projects.map(p => `"${p}"`).join(',')})`
    query += ` AND type in (${types.join(',')})`
    query += ` AND status CHANGED TO "${toStatus}" DURING ("${fromMoment.format('YYYY-MM-DD')}", "${toMoment.format('YYYY-MM-DD')}")`
    log.finest(`JQL: ${query}`)
    let params = { jql: query, fields: this.extractFieldKeys(keys).join(',') }
    let issues = this.unpagedJQLSearch(params).map(issue => keys.map(key => _.get(issue, key.split('.'))))
    issues.forEach(i => log.finest(i))
    return issues
  }

}

var JiraFieldSearchService = class JiraFieldSearchService extends jira.JiraSearchService {
  constructor(jiraApi) {
    super(jiraApi)
    importUnderscore()
  }

  /**
   * @param keys {Array.<string>}
   * @returns {Array.<string>}
   */
  onlyFirstKey(keys) {
    return keys.map(k => k.split('.')).map(k => k[0])
  }

  /**
   * @param jql {string}
   * @param fields {Array.<string>}
   */
  issueFieldsWithJQl(jql, fields = []) {
    log.info(`searching issues with [${jql}], returning fields [${fields}]`)
    let keys = ['key', ...fields.map(f=>`fields.${f}`)]
    let unmappedIssues = this.unpagedJQLSearch({ jql: jql, fields: this.onlyFirstKey(fields) })

    let issues = unmappedIssues.map(issue => keys.map(key => _.get(issue, key.split('.'))))
    issues.forEach(i => log.finest(i))

    return issues
  }
}
