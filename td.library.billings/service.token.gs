const TempoTokenService = class TempoTokenService {

  constructor() {
    this.properties = ScriptProperties
    this.propertyName = 'tempo.token'
  }

  getToken() {
    return this.properties.getProperty(this.propertyName)
  }
}

