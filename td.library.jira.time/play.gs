function playSearchService() {
  let username = Session.getActiveUser().getEmail()
  let scriptProps = new prop.ScripPropGetter()
  let jiraApi = api.createBasic(scriptProps.jiraEndpoint, username, scriptProps.jiraToken)
  let searchService = new JiraIssueSearchService(jiraApi)

  // console.log(searchService.timespentInTimeframe(moment('2023-01-01', 'YYYY-MM-DD'), moment('2023-05-01', 'YYYY-MM-DD').endOf('month'), ['FRA', 'HYDAC'], 'Ready to deploy live'))
  console.log(issuesWithTimespentInTimeframe('01.01.2023', '01.06.2023', 'FRA', 'Ready to deploy live', 'Story'))
}
