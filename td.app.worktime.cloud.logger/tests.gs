function testJiraMyself() {
  let jiraToken = PropertiesService.getScriptProperties().getProperty('jiraToken')
  let endpoint = "https://techdivision.atlassian.net/rest/api/3/myself"
  let username = 'c.daehn@techdivision.com'
  let jiraApi = api.createBasic(endpoint, username, jiraToken)
  console.log(jiraApi.fetch())
}

function testTempo() {
  let tempoToken = PropertiesService.getScriptProperties().getProperty('tempoToken')
  let endpoint = "https://api.tempo.io/4/worklogs"
  let tempoApi = api.createBearer(endpoint, tempoToken)
  console.log(tempoApi.fetch())
}

class AssertionError extends Error {
  constructor(message) {
    super(message)
  }
}

function assert(expression, optMessage) {
  if (!expression) {
    let message = 'Assertion failed';
    if (optMessage !== undefined) {
      message = message + ': ' + optMessage;
    }
    let error = new AssertionError(message)

    throw error;
  }
}

function assertTypeOf(object, type) {
  typeofObject = Object.prototype.toString.call(object).slice(8, -1).toLowerCase()
  assert(typeofObject === type, `expect ${object} to be of type ${type}, but was of type ${typeofObject}`)
}
