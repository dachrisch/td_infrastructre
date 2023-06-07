class AuthorizationProvider {
  authHeaders() {
    throw new Error('not implemented');
  }
}

class BearerAuthorizationProvider extends AuthorizationProvider {
  constructor(authToken) {
    super()
    this.authToken = authToken
  }
  authHeaders() {
    return {
      Authorization: `Bearer ${this.authToken}`
    }
  }
}

class BasicAuthorizationProvider extends AuthorizationProvider {
  constructor(username, authToken) {
    super()
    this.username = username
    this.authToken = authToken
  }
  authHeaders() {
    return {
      Authorization: `Basic ${Utilities.base64Encode(this.username + ':' + this.authToken)}`
    }
  }
}
