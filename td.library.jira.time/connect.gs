if ((typeof moment) === 'undefined') {
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js').getContentText());
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.40/moment-timezone-with-data.min.js').getContentText());
}

/**
 * connect function for use in spreadsheets
 * @param startDate {string} - Date in format DD.MM.YYYY
 * @param endDate {string} - Date in format DD.MM.YYYY
 * @param projects {string | Array.<string>}
 * @param toStatus {string}
 * @param types {string | Array.<string>}
 */
function issuesWithTimespentInTimeframe(startDate, endDate, projects, toStatus, types) {
  let username = 'c.daehn@techdivision.com'
  let scriptProps = new prop.ScripPropGetter()
  let jiraApi = api.createBasic(scriptProps.jiraEndpoint, username, scriptProps.jiraToken)
  let searchService = new JiraIssueSearchService(jiraApi)

  return searchService.timespentInTimeframe(
    moment(startDate, 'DD.MM.YYYY'),
    moment(endDate, 'DD.MM.YYYY'),
    projects.map ? projects : [projects],
    toStatus,
    types.map ? types : [types]
  )
}
