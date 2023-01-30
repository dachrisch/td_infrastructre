
function runAllTests() {
  let logMessages = [];

  const test = new GasTap({ logger: (msg) => logMessages.push(msg) })
  for (const this_function in this) {
    if (this[this_function] instanceof Function && this_function.endsWith('TestRunner')) {
      console.log(`running test ${this_function}`)
      this[this_function](test)
    }
  }

  test.finish()
  logMessages.forEach((msg) => console.log(msg))

}

function _check_keys(t, event_checks, worklog) {
  for (key in event_checks) {
    if (typeof event_checks[key] === 'object') {
      _check_keys(t, event_checks[key], worklog[key], `check that ${key} matches`)
    } else {
      let check = worklog[key]
      if (check === 'undefined') {
        check = 'this must fail xxx'
      }
      t.equal(event_checks[key], check, `check that ${key} matches`)
    }
  }
}
function check_object_matches(t, event_checks, worklog, desc) {
  let old_desc = t.description
  t.description = desc || old_desc
  _check_keys(t, event_checks, worklog)
  t.description = old_desc
}

function atest() {
  console.log(auth_headers())
}