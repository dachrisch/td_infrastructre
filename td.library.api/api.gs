var log = BBLog.getLog({
  sheetId: null,
  level: BBLog.Level.INFO,
  useNativeLogger: true
})

String.prototype.addQuery = function (parameter) {
  log.finer(`adding parameter [${JSON.stringify(parameter)}] to [${this}]`)
  let queryPart = (parameter != undefined && Object.entries(parameter).length > 0) ? "?" + Object.entries(parameter).flatMap(([k, v]) => Array.isArray(v) ? v.map(e => `${k}=${encodeURIComponent(e)}`) : `${k}=${encodeURIComponent(v)}`).join("&") : ''
  return this + queryPart
}

var ApiConnector = class ApiConnector {

  /**
   * @param {String} endpoint - Endpoint to an API
   * @param {String} authToken - Personal access token
   */
  constructor(endpoint, authToken) {
    this.endpoint = endpoint
    this.authToken = authToken
    log.fine(`connecting to ${this}`)
  }

  on(part) {
    return new ApiConnector(((part == undefined) ? this.endpoint : (this.endpoint + '/' + part)), this.authToken)
  }

  post(json_payload, expectedResponseCode = 200) {
    let options = {
      headers: this.authHeaders(),
      method: 'post',
      payload: JSON.stringify(json_payload),
      contentType: 'application/json;charset=UTF-8',
      muteHttpExceptions: true
    };

    return this.validatedFetch(this.endpoint, options, expectedResponseCode)
  }

  fetch() {
    return this.fetchWithParams()
  }

  fetchWithParams(params, expectedResponseCode = 200) {
    let options = {
      headers: this.authHeaders(),
      method: 'get',
      contentType: 'application/json;charset=UTF-8',
      muteHttpExceptions: true
    };

    let queryEndpoint = this.endpoint.addQuery(params)
    return this.validatedFetch(queryEndpoint, options, expectedResponseCode)
  }


  validatedFetch(endpoint, options, expectedResponseCode) {
    log.fine(`about to [${options.method.toUpperCase()}] [${endpoint}] with ${JSON.stringify(options)}`)
    let response = UrlFetchApp.fetch(endpoint, options)
    return this.validate(response, expectedResponseCode)
  }

  validate(response, expectedResponseCode) {
    log.finest(`validating response [${response}]`)
    let responseCode = response.getResponseCode()
    if (expectedResponseCode != responseCode) { throw `error [${responseCode}] fetching ${this.endpoint}: ${response.getContentText()}` }
    let jsonResponse = JSON.parse(response.getContentText())
    return jsonResponse
  }

  remove() {
    let options = {
      headers: this.authHeaders(),
      method: 'delete',
      muteHttpExceptions: true
    };
    log.fine(`about to delete [${this.endpoint}] with ${JSON.stringify(options)}`)
    let responseCode = UrlFetchApp.fetch(this.endpoint, options).getResponseCode()
    if (204 != responseCode) { throw `error [${responseCode}] deleting ${this.endpoint}: ${response.getContentText()}` }
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
