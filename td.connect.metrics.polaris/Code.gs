function issuesFromQueryWithFields(jql, fields) {
  console.log(fields)
  console.log(typeof fields)
  let result = jiraTime.issuesFromQueryWithFields(jql, fields)
  console.log(result)
  return result
}
