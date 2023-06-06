
function get_token() {
  console.log(tempo_token())
}

function myself() {
  console.log(Session.getActiveUser().getEmail())
}

function connect() {
  console.log(connectToTempo())
}
