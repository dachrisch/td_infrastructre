class PropGetter extends entity.Entity {
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

var ScripPropGetter = class ScripPropGetter extends PropGetter {
  constructor() {
    super(PropertiesService.getScriptProperties())
  }
}


var UserPropGetter = class UserPropGetter extends PropGetter {
  constructor() {
    super(PropertiesService.getUserProperties())
  }
}
