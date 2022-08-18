function test() {
  console.log(assignedFor('galdobins'))
}

function token() {
  return 'OTA0NTk1NDMwNTcyOsHqkZpSVG+on5doMIYZBvAQj79U'
}

/**
 * function which is called by trigger to genrate snapshot
 */
function makeTeamWiPSnapshot() {
  setValues(setupSheet(), mapSnapshotToValues(snapshotWip(teamMember())))
}

/**
 * filter to enable custom functions to act on ranges (i.e. ARRAYFORMULAS), which contain empty values
 * @param {(String|Array.<String>)} n - Elements to filter
 */
function emptyElementsFilter(n) {
  return n != null && n != [''] && n != ''
}

/**
 * @param {(String|Array.<String>)} who - jira ids or list of ids
 * @param {Date} time - Just used to refresh when called from GSheet
 * @return {Array} Keys assigned to {who} globally
 */
function totalAssignedFor(who, time = null) {
  if (who.map) {
    return who.filter(emptyElementsFilter).map(totalAssignedFor)
  } else {
    return TDJiraConnector.JQL(token(), `assignee = ${who}`).length
  }
}

/**
 * retrieves project query from active sheet by named range 'query_project'
 */
function projectQuery() {
  return SpreadsheetApp.getActiveSpreadsheet().getRangeByName('query_project').getValues().flat()[0]
}

/**
 * retrieves wip query from active sheet by named range 'query_wip'
 */
function wipQuery() {
  return SpreadsheetApp.getActiveSpreadsheet().getRangeByName('query_wip').getValues().flat()[0]
}

/**
 * @param {(String|Array.<String>)} who - jira ids or list of ids
 * @param {Date} time - Just used to refresh when called from GSheet
 * @return {Array} Number of tickets assigned to {who} in project
 */
function assignedFor(who, time = null) {
  if (who.map) {
    return who.filter(emptyElementsFilter).map(assignedFor)
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
    return who.filter(emptyElementsFilter).filter(n => n != null).map(wipFor)
  } else {
    return TDJiraConnector.JQL(token(), `${projectQuery()} AND assignee = ${who} AND ${wipQuery()}`).length
  }
}

/**
 * @return {Array} List of team member's Jira ids
 */
function teamMember() {
  return SpreadsheetApp.getActiveSpreadsheet().getRangeByName('member_ids').getValues().flat().filter(emptyElementsFilter)
}

/**
 * @param {Array.<String>} jiraIds
 * @return {Object} - Object containing {'name' : {'assigned' : <num>, 'wip' : <num>}}
 */
function snapshotWip(jiraIds) {
  return jiraIds.reduce((obj, jiraId) => Object.assign(obj, { [jiraId]: { assigned: assignedFor(jiraId), wip: wipFor(jiraId) } }), {});
}

/**
 * @param {Array.<Object>} snapshots
 * @return {Array.<Array>} Array with time, name, assigned and wip
 */
function mapSnapshotToValues(snapshots) {
  let snapshotTime = new Date()
  return Object.keys(snapshots).map((name) => [snapshotTime, name, snapshots[name].assigned, snapshots[name].wip])
}

/**
 * @param {SpreadsheetApp} sheet
 * @param {Array.<Array>} values
 */
function setValues(sheet, values) {
  let lastRow = sheet.getLastRow()
  let valuesRange = `A${lastRow + 1}:D${lastRow + values.length}`
  sheet.getRange(valuesRange).setValues(values)
}
/**
 * 
 * created the sheet and headers if necessary   
 * 
 * @return {SpreadsheetApp} the snapshot sheet
 */
function setupSheet() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('snapshots')
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('snapshots')
  }
  let header = sheet.getRange('A1:D1').getValues().flat()
  if (header.some(cell => '' == cell)) {
    sheet.getRange('A1:D1').setValues([['Time', 'Jira ID', 'assigned', 'wip']])
    sheet.getRange('E1').setValue('Name')
    sheet.getRange('E2').setFormula('=ARRAYFORMULA(iferror(VLOOKUP(B2:B,{member_ids,member_names},2,false)))')
  }

  return sheet
}
