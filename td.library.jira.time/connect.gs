if ((typeof moment) === 'undefined') {
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js').getContentText());
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.40/moment-timezone-with-data.min.js').getContentText());
}

function emptyElementsFilter(n) {
  return n != null && n != [''] && n != ''
}

/**
 * connect function for use in spreadsheets
 * @param startDate {string} - Date in format DD.MM.YYYY
 * @param endDate {string} - Date in format DD.MM.YYYY
 * @param projects {string | Array.<string>}
 * @param toStatus {string}
 * @param types {string | Array.<string>}
 */
function issuesWithStatusChangeInTimeframe(startDate, endDate, projects, toStatus, types, keys = 'key, fields.issuetype.name, fields.timespent') {
  let username = 'c.daehn@techdivision.com'
  let scriptProps = new prop.ScripPropGetter()
  let jiraApi = api.createBasic(scriptProps.jiraEndpoint, username, scriptProps.jiraToken)
  let searchService = new JiraIssueSearchService(jiraApi)

  return searchService.issuesWithStatusChangeInTimeframe(
    moment(startDate, 'DD.MM.YYYY'),
    moment(endDate, 'DD.MM.YYYY'),
    projects.map ? projects.filter(emptyElementsFilter) : [projects],
    toStatus,
    types.map ? types.filter(emptyElementsFilter) : [types],
    keys === null ? ['key'] : keys.split(',').map(k => k.trim())
  )
}
