const tempoApi = memoize(function tempoApi() {
  api.log.setLevel(logger.Level.FINE)

  let tempoApi = api.createBearer(scriptProperty('tempoEndpoint'), userProperty(tempoToken()))
  return tempoApi
})

const jiraApi = memoize(function jiraApi() {
  let username = Session.getActiveUser().getEmail()
  let jiraApi = api.createBasic(scriptProperty('jiraEndpoint'), username, userProperty(jiraToken()))
  return jiraApi
})

const jiraIssueService = memoize(function jiraIssueService() {
  let issueService = new jira.JiraIssueService(jiraApi())
  return issueService
})

const jiraMyselfService = memoize(function jiraMyselfService() {
  let myselfService = new jira.JiraMyselfService(jiraApi())
  return myselfService
})

const jiraPickerService = memoize(function jiraPickerService() {
  let pickerService = new jira.JiraIssuePickerService(jiraApi())
  return pickerService
})

const tempoDeleteService = memoize(function tempoDeleteService() {
  let deleteService = new jira.TempoWorklogDeleteService(tempoApi())
  return deleteService
})

const tempoSearchService = memoize(function tempoSearchService() {
  let searchService = new jira.TempoWorklogSearchService(tempoApi(), jiraApi())
  return searchService
})

const tempoBookService = memoize(function tempoBookService() {
  let bookService = new jira.TempoWorklogBookService(tempoApi(), jiraApi())
  return bookService
})

const tempoIssues = memoize(function tempoIssues(query) {
  return jiraPickerService().workOnIssues(query)
})

