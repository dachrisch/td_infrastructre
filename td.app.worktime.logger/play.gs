
function get_token() {
  console.log(tempo_token())
}

function myself() {
  console.log(Session.getActiveUser().getEmail())
}

function connect() {
  console.log(connectToTempo())
}

function eventInTempoTest() {
  cleanup()
  let event = CalendarApp.createEvent('Test Event Nine to Five', moment.tz('1970-06-04 09:00', 'Europe/Berlin').toDate(), moment.tz('1970-06-04 17:00', 'Europe/Berlin').toDate())
  event.setDescription('booking://ACCBILLMON-2')
  let c = new cWrap.CalendarAppWrapper()
  jira.log.setLevel(logger.Level.FINEST)

  c.getDefault().getEvents(moment('1970-06-04', 'YYYY-MM-DD'), moment('1970-06-05', 'YYYY-MM-DD')).forEach((e) => {
    console.log(e)
    tempoSearchService().bookingsForEvent(e)
  })

}