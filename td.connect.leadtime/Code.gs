function issuesWithStatusChangeInTimeframe(startDate, endDate, projects, toStatus, types, keys) {
  return jiraTime.issuesWithStatusChangeInTimeframe(startDate, endDate, projects, toStatus, types, keys)
}

function issuesFromQueryWithFields(jql, fields) {
  let result = jiraTime.issuesFromQueryWithFields(jql, fields)
  console.log(result)
  return result
}
