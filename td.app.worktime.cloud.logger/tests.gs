function testJiraMyself() {
  let jiraToken = PropertiesService.getScriptProperties().getProperty('jiraToken')
  let endpoint = "https://techdivision.atlassian.net/rest/api/3/myself"
  let username = 'c.daehn@techdivision.com'
  let jiraApi = api.createBasic(endpoint, username, jiraToken)
  console.log(jiraApi.fetch())
}

function testTempo() {
  let tempoToken = PropertiesService.getScriptProperties().getProperty('tempoToken')
  let endpoint = "https://api.tempo.io/4/worklogs"
  let tempoApi = api.createBearer(endpoint, tempoToken)
  console.log(tempoApi.fetch())
}