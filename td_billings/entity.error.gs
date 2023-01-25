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


const InvalidParameterError = class InvalidParameterError extends Error {
  /**
   * @param {String} parameter - The name of the invalid parameter
   * @param {String} reason - reason why the error was raised
   */
  constructor(parameter, reason) {
    let message = `parameter [${parameter}] is ${reason}`
    super(message)
    this.reason = reason
    this.parameter = parameter;
    this.name = 'InvalidParameterError';
  }
}
