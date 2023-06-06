function tempoApi() {
  let tempoApi = api.createBearer(scriptProperty('tempoEndpoint'), userProperty(tempoToken()))
  return tempoApi
}

function jiraApi() {
  let username = Session.getActiveUser().getEmail()
  let jiraApi = api.createBasic(scriptProperty('jiraEndpoint'), username, userProperty(jiraToken()))
  return jiraApi
}

function jiraIssueService() {
  let issueService= new jira.JiraIssueService(jiraApi())
  return issueService
}

function jiraMyselfService() {
  let myselfService= new jira.JiraMyselfService(jiraApi())
  return myselfService
}

function jiraPickerService() {
  let pickerService= new jira.JiraIssuePickerService(jiraApi())
  return pickerService
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

function tempoIssues(query) {
  return jiraPickerService().workOnIssues(query)
}

