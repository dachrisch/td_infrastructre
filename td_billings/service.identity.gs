const IdentityService = class IdentityService {
  /**
   * @param {ApiConnector} identityApiConnector
   */
  constructor(identityApiConnector) {
    this.identityApiConnector = identityApiConnector
  }

  _workerKey() { }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }
}

importUnderscore()

IdentityService.prototype.workerKey = _.memoize(function() {
  return this._workerKey()
})

const MyIdentityService = class MyIdentityService extends IdentityService {
  static connect(authToken) {
    return new MyIdentityService(new api.ApiConnector('https://jira.tdservice.cloud/rest/api/2/myself', authToken))
  }

  _workerKey() {
    return this.identityApiConnector.fetch().key
  }

}

const OtherIdentityService = class OtherIdentityService extends IdentityService {
  /**
   * @param {String} authToken
   * @param {String} userEmail - Email of user for which the identity should be used
   */
  static connect(authToken, userEmail) {
    return new OtherIdentityService(new api.ApiConnector('https://jira.tdservice.cloud/rest/api/2/user/search', authToken), userEmail)
  }

  constructor(identityApiConnector, userEmail) {
    super(identityApiConnector)
    this.userEmail = userEmail
  }

  _workerKey() {
    return this.identityApiConnector.fetchWithParams({ username: this.userEmail })[0].key
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}
