function scriptProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key)
}

function userProperty(key) {
  return PropertiesService.getUserProperties().getProperty(key)
}

function setUserProperty(key, value) {
  PropertiesService.getUserProperties().setProperty(key, value)
}

function tempoToken() {
  return 'tempoToken'
}
function jiraToken() {
  return 'jiraToken'
}

function store_token(_jiraToken, _tempoToken) {
  setUserProperty(jiraToken(), _jiraToken)
  setUserProperty(tempoToken(), _tempoToken)
}

function deleteToken() {
  store_token()
}
