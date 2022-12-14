const ApiConnector = class ApiConnector {
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


  fetchWithParams(params) {
    let options = {
      headers: this.authHeaders(),
      method: 'get',
      contentType: 'application/json;charset=UTF-8',
      muteHttpExceptions: true
    };

    let queryEndpoint = this.endpoint.addQuery(params)
    return this.validatedFetch(queryEndpoint, options)
  }

  fetch() {
    return this.validatedFetch(this.endpoint, { headers: this.authHeaders() })
  }

  validatedFetch(endpoint, options) {
    console.log(`about to fetch [${endpoint}] with ${JSON.stringify(options)}`)
    let response = UrlFetchApp.fetch(endpoint, options)
    return this.validate(response)
  }

  validate(response) {
    let responseCode = response.getResponseCode()
    if (200 != responseCode) { throw `error [${responseCode}] fetching ${this.endpoint}: ${response.getContentText()}` }
    let jsonResponse=JSON.parse(response.getContentText())
    return jsonResponse
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
