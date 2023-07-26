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
  let searchService = new JiraIssueStatusChangeSearchService(jiraApi)

  return searchService.issuesWithStatusChangeInTimeframe(
    moment(startDate, 'DD.MM.YYYY'),
    moment(endDate, 'DD.MM.YYYY'),
    projects.map ? projects.filter(emptyElementsFilter) : [projects],
    toStatus,
    types.map ? types.filter(emptyElementsFilter) : [types],
    keys === null ? ['key'] : keys.split(',').map(k => k.trim())
  )
}

/**
 * @param jql {string} The JQL
 * @param fields {Array.<Array.<string>>} (extra) fields to extract, like 'timespent' (directly from sheets range)
 * @return {Array.<Array<any>>} The query result with key and all fields per row
 */
function issuesFromQueryWithFields(jql, fields = undefined) {
  let username = 'c.daehn@techdivision.com'
  let scriptProps = new prop.ScripPropGetter()
  let jiraApi = api.createBasic(scriptProps.jiraEndpoint, username, scriptProps.jiraToken)

  let searchService = new JiraFieldSearchService(jiraApi)

  let flattenedFields = []
  if (fields) {
    if (fields.map && fields.length === 1 && fields[0].map) {
      // horizontal
      flattenedFields = fields[0]
    } else if (fields.map && fields.length > 0 && fields[0].map === undefined) {
      // vertical
      flattenedFields = fields.map(f => f[0])
    } else if (fields.map && fields.length > 0 && fields[0].map) {
      throw `this data structure for fields is not allowed. Have you used a 2-dim array?: ${fields}`
    }
  }
  let result = searchService.issueFieldsWithJQl(jql, flattenedFields)
  return result.length > 0 ? result : null
}