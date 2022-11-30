const ApiConnector = class ApiConnector {
  constructor(endpoint, authToken) {
    this.endpoint = endpoint
    this.authToken = authToken
    console.log(`${this}`)
  }

  post(json_payload) {
    let options = {
      headers: this.authHeaders(),
      method: 'post',
      payload: JSON.stringify(json_payload),
      contentType: 'application/json;charset=UTF-8',
      muteHttpExceptions: true
    };

    return this.validatedFetchJson(options)
  }

  fetch() {
    return this.validatedFetchJson({ headers: this.authHeaders() })
  }

  validatedFetchJson(options) {
    let response = UrlFetchApp.fetch(this.endpoint, options)
    let responseCode = response.getResponseCode()
    if (200 != responseCode) { throw `error [${responseCode}] while posting to ${this.endpoint}: ${response.getContentText()}` }
    return JSON.parse(response.getContentText())
  }

  authHeaders() {
    return {
      Authorization: `Bearer ${this.authToken}`
    }
  }

  toString() {
    return `${this.constructor.name}(endpoint=${this.endpoint})`
  }

}
