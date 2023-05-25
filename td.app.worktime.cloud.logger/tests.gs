var globalTest = false

class AssertionError extends Error {
  constructor(message) {
    super(message)
  }
}

function assert(expression, optMessage) {
  if (!expression) {
    let message = 'Assertion failed';
    if (optMessage !== undefined) {
      message = message + ': ' + optMessage;
    }
    let error = new AssertionError(message)

    throw error;
  }
}

function assertTypeOf(object, type) {
  typeofObject = Object.prototype.toString.call(object).slice(8, -1).toLowerCase()
  assert(typeofObject === type, `expect ${object} to be of type ${type}, but was of type ${typeofObject}`)
}
