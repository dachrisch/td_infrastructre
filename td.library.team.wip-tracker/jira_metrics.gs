/**
 * @param {(String|Array.<String>)} who - jira ids or list of ids
 * @param {Date} time - Just used to refresh when called from GSheet
 * @return {Array} Keys assigned to {who} globally
 */
function totalAssignedFor(who, time = null) {
  if (who.map) {
    return who.filter(sw.emptyElementsFilter).map(totalAssignedFor)
  } else {
    return TDJiraConnector.JQL(token(), `assignee = ${who}`).length
  }
}


function token() {
  return ScriptProperties.getProperty('jira_token')
}


function projectQuery() {
  return `filter = ${teamFilterId()}`
}


function wipQuery() {
  return `status in (${workingColumns().map(c => `"${c}"`).join(', ')})`
}

/**
 * @param {(String|Array.<String>)} who - jira ids or list of ids
 * @param {Date} time - Just used to refresh when called from GSheet
 * @return {Array} Number of tickets assigned to {who} in project
 */
function assignedFor(who, time = null) {
  if (who.map) {
    return who.filter(sw.emptyElementsFilter).map(assignedFor)
  } else {
    return TDJiraConnector.JQL(token(), `${projectQuery()} AND assignee = ${who}`).length
  }
}

/**
 * @param {(String|Array.<String>)} who - jira ids or list of ids
 * @param {Date} time - Just used to refresh when called from GSheet
 * @return {Array} Number of tickets assigned to {who} and in progress
 */
function wipFor(who, time = null) {
  if (who.map) {
    return who.filter(sw.emptyElementsFilter).map(wipFor)
  } else {
    return TDJiraConnector.JQL(token(), `${projectQuery()} AND assignee = ${who} AND ${wipQuery()}`).length
  }
}
