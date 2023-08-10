function issuesFromQueryWithFields(jql, fields) {
  let result = jiraTime.issuesFromQueryWithFields(jql, fields)
  console.log(result)
  return result
}

function issuesFromQueryWithSingleField(jql, field) {
  let result = null
  if (jql.map) {
    console.log('map detected')
    result = jql.map(j => issuesFromQueryWithSingleField(j, [[field]]).map(r => r[1]))
  } else {
    let partial = jiraTime.issuesFromQueryWithFields(jql, [[field]])
    result = partial? partial.map(r => r[1]) : []
  }
  console.log(result)
  return result
}

