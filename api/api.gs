String.prototype.addQuery = function (parameter) {
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
  }

  post(json_payload) {
    let options = {
      headers: this.authHeaders(),
      method: 'post',
      payload: JSON.stringify(json_payload),
      contentType: 'application/json;charset=UTF-8',
      muteHttpExceptions: true
    };

    return this.validatedFetch(this.endpoint, options)
  }

  fetch(part) {
    return this.fetchWithParams(part)
  }

  fetchWithParams(part, params) {
    let options = {
      headers: this.authHeaders(),
      method: 'get',
      contentType: 'application/json;charset=UTF-8',
      muteHttpExceptions: true
    };

    let queryEndpoint = ((part == undefined) ? this.endpoint : (this.endpoint + '/' + part)).addQuery(params)
    return this.validatedFetch(queryEndpoint, options)
  }


  validatedFetch(endpoint, options) {
    console.log(`about to fetch [${endpoint}] with ${JSON.stringify(options)}`)
    let response = UrlFetchApp.fetch(endpoint, options)
    return this.validate(response)
  }

  validate(response) {
    let responseCode = response.getResponseCode()
    if (200 != responseCode) { throw `error [${responseCode}] fetching ${this.endpoint}: ${response.getContentText()}` }
    let jsonResponse = JSON.parse(response.getContentText())
    return jsonResponse
  }

  remove(part) {
    let options = {
      headers: this.authHeaders(),
      method: 'delete',
      muteHttpExceptions: true
    };
    let queryEndpoint = ((part == undefined) ? this.endpoint : (this.endpoint + '/' + part))
    console.log(`about to delete [${queryEndpoint}] with ${JSON.stringify(options)}`)
    let responseCode = UrlFetchApp.fetch(queryEndpoint, options).getResponseCode()
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
