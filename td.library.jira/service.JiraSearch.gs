var JiraSearchService = class JiraSearchService extends JiraService {
  constructor(jiraApi) {
    super(jiraApi.on('search'))
  }

  /**
   * Search with JQL and expand all pages into one array
   * @param {{ jql: string, fields: string }} params - The JQL query string as obtained with Jira. The (extra) fields to extract as comma separated string, e.g. 'timespent,timeestimate'
   * @param offset {number}
   * @return {Array.<{id:string,self:string,key:string,fields:{any:any}}>}
   */
  unpagedJQLSearch(params, offset = 0) {
    log.finest(`paged search with offset ${offset}: ${JSON.stringify(params)}`)
    let allIssues = []
    params.startAt = offset
    let issuesSearch = this.pagedJQLSearch(params)
    log.finest(issuesSearch)
    allIssues.push(...issuesSearch.issues)
    if (issuesSearch.startAt + issuesSearch.maxResults < issuesSearch.total) {
      allIssues.push(...this.unpagedJQLSearch(params, offset + issuesSearch.maxResults))
    }
    return allIssues
  }

  /**
   * Performs a singe page search
   * @param {{ jql: string, fields: string, startAt:number }} params - The JQL query string as obtained with Jira. The (extra) fields to extract as comma separated string, e.g. 'timespent,timeestimate'
   * @return {{ startAt:number, maxResults:number, total:number, issues:Array.<{id:string,self:string,key:string,fields:{any:any}}> }}
   */
  pagedJQLSearch(params) {
    return this.jiraApi.fetchWithParams(params)

  }
}
