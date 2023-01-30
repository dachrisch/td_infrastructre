/**
 * queries Jira
 * 
 * Import this Library
 * https://script.google.com/home/projects/1B04jG0zZmOpPm1PTV1nKQ3iDwx792lxbwxD3FwZ_ke7UIV8_lo9gHhjR/settings
 * 
 * Usage in Spreadsheet:
 * create AppScript functions as follows
 *
 * function JQL() {
 *  return TDJiraConnector.JQL.apply(this, arguments);
 * };
 * 
 * @param {string} token - jira access token
 * @param {string} query - JQL query string
 * @param {string} [keys='key'] - comma separated list of keys to retrieve (https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-get)
 * 
 * @return {string[]} List of results for each resolved key
 */
function JQL(token, query, keys = 'key') {
  let endpoint = 'https://jira.tdservice.cloud/rest/api/2/search'
  let jql_query = endpoint + '?jql=' + encodeURIComponent(query)
  let response = UrlFetchApp.fetch(jql_query, { headers: { Authorization: "Bearer " + token } })
  let json_response = JSON.parse(response.getContentText())

  let issue_keys = json_response.issues.map(issue => keys.split(',').map(key => _.get(issue, key.trim())))
  return issue_keys
}

if ((typeof _) === 'undefined') {
  eval(UrlFetchApp.fetch('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js').getContentText());
}
