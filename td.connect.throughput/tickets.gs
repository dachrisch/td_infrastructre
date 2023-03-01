function test() {
  console.log(countTicketsChangedInTimeframe(['to deploy', 'ReleaseBuilding'], [[new Date(2022, 10, 14)], [new Date(2022, 10, 21)]], [[new Date(2022, 10, 20)], [new Date(2022, 10, 28)]], ['Frankana', 'HTM Sport'], ['HYDAC', ''], ['team-polaris', 'team-allstars']))

}

/**
 * @param {Array.<String>} statiTo - all status the ticket is changed to
 * @param {Date|Array.<Date>} periodBegin - start Date during the transition occoured
 * @param {Date|Array.<Date>} periodEnd - end Date during the transition occoured
 * @param {Array.<String>} projects - take these projects into accout
 * @param {Array.<String>} labelProjects - take these projects into accout with labels
 * @param {Array.<String>} labels - labels to look for in labelProjects
 * 
 * @return {Array.<String>|Array.<Array.<String>>} - ticket id, ticket type
 */
function ticketsChangedInTimeframe(statiTo, periodBegin, periodEnd, projects, labelProjects, labels) {
  if (is1DimArrayformula(periodBegin) && is1DimArrayformula(periodEnd) && periodBegin.length == periodEnd.length) {
    log.fine(`detected array for period, running for all values: [${periodBegin}], [${periodBegin}]`)
    return periodBegin.filter(emptyElementsFilter).map((p, i) => ticketsChangedInTimeframe(statiTo, p[0], periodEnd[i][0], projects, labelProjects, labels))
  } else {
    let query = `status changed to (${statiTo.flatten(',', '"')}) during ("${periodBegin.toJiraDate()}", "${periodEnd.toJiraDate()}")  AND (project in (${projects.flatten(',', '"')}) OR project in (${labelProjects.flatten(',', '"')}) AND labels in (${labels.flatten(',', '')}))`
    log.info(query)
    let tickets = jira.JQL(ScriptProperties.getProperty('tempo.token'), query, 'key, fields.issuetype.name')
    log.fine(tickets)
    return tickets
  }
}
/**
 * @param {Array.<String>} statiTo - all status the ticket is changed to
 * @param {Date|Array.<Date>} periodBegin - start Date during the transition occoured
 * @param {Date|Array.<Date>} periodEnd - end Date during the transition occoured
 * @param {Array.<String>} projects - take these projects into accout
 * @param {Array.<String>} labelProjects - take these projects into accout with labels
 * @param {Array.<String>} labels - labels to look for in labelProjects
 * 
 * @return {Number|Array.<Number>} - count of tickets
 */
function countTicketsChangedInTimeframe(statiTo, periodBegin, periodEnd, projects, labelProjects, labels) {
  let tickets = ticketsChangedInTimeframe(statiTo, periodBegin, periodEnd, projects, labelProjects, labels)
  if (periodBegin.map && periodEnd.map && periodBegin.length == periodEnd.length) {
    log.fine(`tickets for [${periodBegin}]: [${tickets.map(t => t.length)}]`)
    return tickets.map(t => t.length)
  } else {
    log.fine(`tickets for [${periodBegin}, ${periodEnd}]: ${tickets.length}`)
    return tickets.length
  }
}
