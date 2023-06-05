function tempoApi() {
  let tempoApi = api.createBearer(scriptProperty('tempoEndpoint'), scriptProperty('tempoToken'))
  return tempoApi
}

function jiraApi() {
  let username = 'c.daehn@techdivision.com'
  let jiraApi = api.createBasic(scriptProperty('jiraEndpoint'), username, scriptProperty('jiraToken'))
  return jiraApi
}

function jiraIssueService() {
  let issueService= new jira.JiraIssueService(jiraApi())
  return issueService
}

function tempoDeleteService() {
  let deleteService = new jira.TempoWorklogDeleteService(tempoApi())
  return deleteService
}

function tempoSearchService() {
  let searchService = new jira.TempoWorklogSearchService(tempoApi(), jiraApi())
  return searchService
}

function tempoBookService() {
  let bookService = new jira.TempoWorklogBookService(tempoApi(), jiraApi())
  return bookService
}