var JiraIssueSearchService = class JiraIssueSearchService extends jira.JiraService {
  constructor(jiraApi) {
    super(jiraApi.on('search'))
  }

  /**
   * find time spent for issues in timeframe
   * @param fromMoment {moment}
   * @param toMoment {moment}
   * @param projects {Array.<string>}
   * @param toStatus {string}
   * @param types {string | Array.<string>}
   */
  timespentInTimeframe(fromMoment, toMoment, projects, toStatus, types) {
    log.info(`searching for issues in [${projects}] with status change to [${toStatus}] during [${fromMoment.format('YYYY-MM-DD')}, ${toMoment.format('YYYY-MM-DD')}]`)
    let query = `project in (${projects.map(p => `"${p}"`).join(',')})`
    query+=` AND type in (${types.join(',')})`
    query += ` AND status CHANGED TO "${toStatus}" DURING ("${fromMoment.format('YYYY-MM-DD')}", "${toMoment.format('YYYY-MM-DD')}")`
    log.finest(`JQL: ${query}`)
    let params = { jql: query, properties: 'key, issuetype', fields: ['timespent'] }
    let issues = this.unpagesSearch(params).map(issue => [issue.key, issue.fields.timespent])
    log.finest(issues)
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