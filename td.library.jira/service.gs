var Service = class Service {

  memberToString() {
    return Object.getOwnPropertyNames(this).map((propertyName) => {
      let propertyValue = this[propertyName]
      if (propertyValue) {
        propertyValue = JSON.stringify(this[propertyName].toString())
      }
      return `${propertyName}=${propertyValue}`
    }).join(', ')

  }
  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}