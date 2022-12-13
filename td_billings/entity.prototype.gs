Object.prototype.memberToString = function () {
  return Object.getOwnPropertyNames(this).map((propertyName) => `${propertyName}=${this[propertyName]}`).join(', ')
}

String.prototype.addQuery = function (parameter) {
  return this + "?" + Object.entries(parameter).flatMap(([k, v]) => Array.isArray(v) ? v.map(e => `${k}=${encodeURIComponent(e)}`) : `${k}=${encodeURIComponent(v)}`).join("&");
}

class AssertionError extends Error {
  constructor(message) {
    super(message)
    this.message=message;
    this.name = "AssertionError";
  }

  toString() {
    return `${this.constructor.name}(message=${this.message}): ${this.stack}`
  }
}

function assert(expression, message) {
  if (!expression) {
    let callee=arguments.callee
    console.log(callee.toString())

    console.log(arguments.callee.caller.toString())
    throw new AssertionError(message)
  }
}
