function testJiraMyself() {
  let jiraToken = "ATATT3xFfGF0p3FUIwmfoMEFZHkD19SFdsLH7Qjb11BzX01jF4uOVwBpP7pfS3W_AnD8X0EhMDu02Wi-1BwXaesX0xlWhHqgwHKBlRmfXuTiNB20TxIUwAKFDxBNRvHWImaow4ojPnCdvGdwiWXuZmQ7Ckc7y0J52LODz0OAgptNMBeL1u_ktMs=BB5CFEEB"
  let endpoint = "https://techdivision.atlassian.net/rest/api/3/myself"
  let username = 'c.daehn@techdivision.com'
  let jiraApi = api.createBasic(endpoint, username, jiraToken)
  console.log(jiraApi.fetch())
}

function testTempo() {
  let tempoToken = "KRdDrzdfEfNh7Uz0eYhJmlz0UCFiNd"
  let endpoint = "https://api.tempo.io/4/worklogs"
  let tempoApi = api.createBearer(endpoint, tempoToken)
  console.log(tempoApi.fetch())
}