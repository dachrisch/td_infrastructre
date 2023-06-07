class Properties extends entity.Entity {
  constructor(properties) {
    super()
    this.properties = properties
    this._createPropertyGetter(this.properties)
  }

  /**
   * creates property getter, which resolve the property dynamicaly
   * @param {PropertiesService.Properties} properties
   * @see @link https://developers.google.com/apps-script/reference/properties/properties
   */
  _createPropertyGetter(properties) {
    properties.getKeys().forEach((sp) => {
      Object.defineProperty(this, sp, {
        get() {
          return properties.getProperty(sp)
        },
      });
    })

  }
}

var ScriptProperties = class ScriptProperties extends Properties {
  constructor() {
    super(PropertiesService.getScriptProperties())
  }
}


var UserProperties = class UserProperties extends Properties {
  constructor() {
    super(PropertiesService.getUserProperties())
  }
}
