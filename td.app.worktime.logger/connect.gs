
function connectToJira() {
  if (!userProperty(jiraToken())) {
    throw new AuthorizationError('not jira token set')
  }
  let name = jiraApi().on('myself').fetch().displayName
  console.log(`connected ${name}`)
  return name
}

function connectToTempo() {
  if (!userProperty(jiraToken())) {
    throw new AuthorizationError('not jira token set')
  }
  if (!userProperty(tempoToken())) {
    throw new AuthorizationError('not tempo token set')
  }
  let myself = jiraMyselfService().getMyself()
  tempoApi().on('worklogs').on('search').post({ authorIds: [myself.accountId] })
  return myself.displayName
}
