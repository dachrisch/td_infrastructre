function testAll() {
  for (const this_function in this) {
    if (this[this_function] instanceof Function && this_function.startsWith('test')) {
      console.log(`running test ${this_function}`)
      this[this_function]()
    }
  }
}


function testScriptProperties() {
  PropertiesService.getScriptProperties().setProperty('test1', '')
  let sp = new ScriptProperties()
  console.log(`${sp}`)
  let rand = Math.floor(Math.random() * 1000)
  PropertiesService.getScriptProperties().setProperty('test1', rand)
  console.log(`${sp}`)
  if (!(sp.test1 == rand)) throw 'error'
  PropertiesService.getScriptProperties().setProperty('test1', Math.floor(Math.random() * 1000))
  console.log(`${sp}`)
  if (!(sp.test1 != rand)) throw 'error'
}

function testUserProperties() {
  PropertiesService.getUserProperties().setProperty('test1', '')
  let sp = new UserProperties()
  console.log(`${sp}`)
  let rand = Math.floor(Math.random() * 1000)
  PropertiesService.getUserProperties().setProperty('test1', rand)
  console.log(`${sp}`)
  if (!(sp.test1 == rand)) throw 'error'
  PropertiesService.getUserProperties().setProperty('test1', Math.floor(Math.random() * 1000))
  console.log(`${sp}`)
  if (!(sp.test1 != rand)) throw 'error'
}