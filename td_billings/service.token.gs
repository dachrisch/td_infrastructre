const TempoTokenService = class TempoTokenService {

  /**
   * @param {Properties} properties
   */
  constructor(properties) {
    this.properties = properties
    this.propertyName = 'tempo.token'
  }

  getToken() {
    return this.properties.getProperty(this.propertyName)
  }

  store(token) {
    console.log(`storing tempo token [${token}] in [${this.propertyName}]`);
    this.properties.setProperty(this.propertyName, token);
  }
}

