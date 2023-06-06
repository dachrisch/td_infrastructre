
function get_token() {
  console.log(tempo_token())
}

function myself() {
  console.log(Session.getActiveUser().getEmail())
}

function connect() {
  console.log(connectToTempo())
}

function dict() {
  class I {
    static getInstance() {
      if (!('instance' in I)) {
        I.instance = new I()
      }
      return I.instance
    }

    constructor() {
      this.me = new Date().getMilliseconds()
    }
  }

  function f() {
    if (!('value' in f)) {
      f.value = new Date().getMilliseconds()
    }
    return f.value
  }

  console.log(f())
  console.log(I.getInstance())
  console.log(new I())
  console.log(I.getInstance())
  console.log(f())
}