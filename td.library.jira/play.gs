function myFunction() {
  let username = Session.getActiveUser().getEmail()
  let jiraApi = api.createBasic(PropertiesService.getScriptProperties().getProperty('jiraEndpoint'), username, PropertiesService.getScriptProperties().getProperty('jiraToken'))
  let issueService = new JiraIssueService(jiraApi)

  console.log(issueService.getIssue('ACCBILLMON-2', ['io.tempo.jira__account']))
}
