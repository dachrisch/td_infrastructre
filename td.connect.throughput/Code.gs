function test() {
  ticketsChangedInTimeframe(['to deploy', 'ReleaseBuilding'], new Date(2022, 10, 14), new Date(2022, 10, 20), ['Frankana', 'HTM Sport'], ['HYDAC',''], ['team-polaris', 'team-allstars'])
}

/**
 * filter to enable custom functions to act on ranges (i.e. ARRAYFORMULAS), which contain empty values
 * @param {(String|Array.<String>)} n - Elements to filter
 */
function emptyElementsFilter(n) {
  return n != null && n != [''] && n != ''
}

Array.prototype.flatten = function (delim, surround) {
  return this.filter(emptyElementsFilter).map(a => `${surround}${a}${surround}`).join(delim)
}

Date.prototype.toJiraDate = function () {
  return `${this.getFullYear()}/${this.getMonth() + 1}/${this.getDate()}`
}

/**
 * @param {Array.<String>} statiTo - all status the ticket is changed to
 * @param {Date} periodBegin - start Date during the transition occoured
 * @param {Date} periodEnd - end Date during the transition occoured
 * @param {Array.<String>} projects - take these projects into accout
 * @param {Array.<String>} labelProjects - take these projects into accout with labels
 * @param {Array.<String>} labels - labels to look for in labelProjects
 */
function ticketsChangedInTimeframe(statiTo, periodBegin, periodEnd, projects, labelProjects, labels) {
  console.log(statiTo.flatten(',', '"'))
  let query = `status changed to (${statiTo.flatten(',', '"')}) during ("${periodBegin.toJiraDate()}", "${periodEnd.toJiraDate()}")  AND (project in (${projects.flatten(',', '"')}) OR project in (${labelProjects.flatten(',', '"')}) AND labels in (${labels.flatten(',', '')}))`

  console.log(query)
  return jira.JQL(ScriptProperties.getProperty('tempo.token'), query)
}
