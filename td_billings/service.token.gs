const TempoTokenService = class TempoTokenService {

  /**
   * @param {Properties} userProperties
   */
  constructor(userProperties) {
    this.userProperties=userProperties
    this.propertyName = 'tempo.token'
  }

  getToken() {
    return this.userProperties.getProperty(this.propertyName)
  }

  store(token) {
    console.log(`storing tempo token [${token}] in [${this.propertyName}]`);
    this.userProperties.setProperty(this.propertyName, token);
  }
}

