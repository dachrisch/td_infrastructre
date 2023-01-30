const IdentityService = class IdentityService {
  /**
   * @param {ApiConnector} identityApiConnector
   */
  constructor(identityApiConnector) {
    this.identityApiConnector = identityApiConnector
  }

  workerKey() {
    return this._workerKey()
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }
}

importUnderscore()

const MyIdentityService = class MyIdentityService extends IdentityService {
  static connect(authToken) {
    return new MyIdentityService(new api.ApiConnector('https://jira.tdservice.cloud/rest/api/2/myself', authToken))
  }

  _workerKey() {
    return _.memoize(function(){return this.identityApiConnector.fetch().key})
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
    // https://stackoverflow.com/questions/24486856/how-underscore-memoize-is-implemented-in-javascript
    return _.memoize(function (identityApiConnector, userEmail) {
      return identityApiConnector.fetchWithParams({ username: userEmail })[0].key
    })(this.identityApiConnector, this.userEmail)
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}
