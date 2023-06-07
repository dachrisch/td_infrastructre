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

function eventCheck() {
  let event = new cWrap.CalendarAppWrapper().byName('worktimes').getEventById('13jtj0r5e7op90a2je9ftnh56s@google.com')

  console.log(event)

  if (!(event.startMoment.isSame(moment("2022-03-07T13:00:00.000")) && event.endMoment.isSame(moment("2022-03-07T17:30:00.000")))) {
    throw `invalid dates: ${event}`
  }
}
