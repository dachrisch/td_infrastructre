const MyIdentityService = class MyIdentityService {
  static connect(authToken) {
    return new MyIdentityService(new ApiConnector('https://jira.tdservice.cloud/rest/api/2/myself', authToken))
  }
  constructor(identityApiConnector) {
    this.identityApiConnector = identityApiConnector
    console.log(`${this}`)
  }
  workerKey() {
    return this.identityApiConnector.fetch().key
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}


const OtherIdentityService = class OtherIdentityService {
  static connect(authToken, userEmail) {
    return new OtherIdentityService(new ApiConnector('https://jira.tdservice.cloud/rest/api/2/user/search', authToken), userEmail)
  }
  constructor(identityApiConnector, userEmail) {
    this.identityApiConnector = identityApiConnector
    this.userEmail = userEmail
    console.log(`${this}`)
  }
  workerKey() {
    return this.identityApiConnector.fetchWithParams({ username: this.userEmail })[0].key
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}
