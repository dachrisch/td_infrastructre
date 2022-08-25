/**
 * @param {String} username - Username to lookup
 * @return {String} - Display name of username
 */
function usernameLookup(username) {
  let endpoint = 'https://jira.tdservice.cloud/rest/api/2/user'
  let profile_query = endpoint + '?username=' + encodeURIComponent(username)
  let response = UrlFetchApp.fetch(profile_query, { headers: { Authorization: "Bearer " + token() } })
  let json_response = JSON.parse(response.getContentText())
  logger.log(`fetching username for [${username}]: ${profile_query}...${json_response.displayName}`)
  return json_response.displayName
}


function firstName(username) {
  if (username.map) {
    return username.filter(emptyElementsFilter).map(firstName)
  } else {
    return usernameLookup(username).split(' ')[0]
  }
}
