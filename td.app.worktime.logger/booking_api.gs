if ((typeof _) === 'undefined') {
  eval(UrlFetchApp.fetch('https://cdn.jsdelivr.net/npm/underscore@1.13.2/underscore-umd-min.js').getContentText());
  _.memoize()
}

function post_worklog(worklog) {
  let endpoint = 'https://jira.tdservice.cloud/rest/tempo-timesheets/4/worklogs/'
  return post(endpoint, worklog.toPayloadJson())
}

function tempoIssues(query) {
  let data = {
    'currentJQL': 'project in projectsWhereUserHasPermission("Work on issues")',
    'query': query,
    'showSubTaskParent': true,
    'showSubTasks': true
  }
  let endpoint = 'https://jira.tdservice.cloud/rest/api/2/issue/picker' + build_query_params(data)
  return fetch(endpoint)
}

const worker = _.memoize(function () {
  return fetch('https://jira.tdservice.cloud/rest/api/2/myself')
})


const fetchIssue = _.memoize(function (issueKey) {
  let endpoint = 'https://jira.tdservice.cloud/rest/api/2/issue/' + issueKey
  let issue = fetch(endpoint)
  return issue
})

const issueId = function(issueKey){return fetchIssue(issueKey)['id']}

const issueAccount = function(issueKey){return fetchIssue(issueKey)['fields']['customfield_11400']}

function delete_fetch(endpoint) {
  let options = {
    headers: auth_headers(),
    method: 'delete'
  }
  console.log(`deleting ${endpoint}...`)
  let response = UrlFetchApp.fetch(endpoint, options)
  let response_code = response.getResponseCode()
  console.log(`got response ${response_code}`)
  if (204 != response_code) { throw `error [${response_code}] while posting to ${endpoint}: ${response.getContentText()}` }
}

/**
 * @param {String} URL of endpoint
 * @param {String} JSON payload 
 */
function post(endpoint, json_payload) {
  let options = {
    headers: auth_headers(),
    method: 'post',
    payload: JSON.stringify(json_payload),
    contentType: 'application/json;charset=UTF-8',
    muteHttpExceptions: true
  };

  return validated_fetch_json(endpoint, options)
}

function fetch(endpoint) {
  return validated_fetch_json(endpoint, { headers: auth_headers() })
}

function validated_fetch_json(endpoint, options) {
  let response = UrlFetchApp.fetch(endpoint, options)
  let response_code = response.getResponseCode()
  if (200 != response_code) { throw `error [${response_code}] while posting to ${endpoint}: ${response.getContentText()}` }
  let response_json = JSON.parse(response.getContentText())
  return response_json
}

function auth_headers() {
  return {
    Authorization: "Bearer " + tempo_token()
  }
}

function build_query_params(params) {
  return Object.keys(params).reduce(function (p, e, i) {
    return p + (i == 0 ? "?" : "&") +
      (Array.isArray(params[e]) ? params[e].reduce(function (str, f, j) {
        return str + e + "=" + encodeURIComponent(f) + (j != params[e].length - 1 ? "&" : "")
      }, "") : e + "=" + encodeURIComponent(params[e]));
  }, "");
}

