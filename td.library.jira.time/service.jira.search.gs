function importUnderscore() {
  if ((typeof _) === 'undefined') {
    eval(UrlFetchApp.fetch('https://cdn.jsdelivr.net/npm/underscore@1.13.6/underscore-umd-min.js').getContentText());
    _.memoize()
  }
}

var JiraIssueSearchService = class JiraIssueSearchService extends jira.JiraService {
  constructor(jiraApi) {
    super(jiraApi.on('search'))
    importUnderscore()
  }

  extractFieldKeys(keys) {
    return keys.map(k=>k.split('.')).filter(k=>k[0]==='fields').map(k=>k[1])
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
    let issues = this.unpagesSearch(params).map(issue => keys.map(key =>  _.get(issue, key.split('.'))))
    issues.forEach(i=>log.finest(i))
    return issues
  }

  unpagesSearch(params, offset = 0) {
    log.finest(`paged search with offset ${offset}: ${JSON.stringify(params)}`)
    let allIssues = []
    params.startAt = offset
    let issuesSearch = this.jiraApi.fetchWithParams(params)
    log.finest(issuesSearch)
    allIssues.push(...issuesSearch.issues)
    if (issuesSearch.startAt + issuesSearch.maxResults < issuesSearch.total) {
      allIssues.push(...this.unpagesSearch(params, offset + issuesSearch.maxResults))
    }
    return allIssues
  }
}