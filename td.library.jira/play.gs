if ((typeof moment) === 'undefined') {
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js').getContentText());
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.40/moment-timezone-with-data.min.js').getContentText());
}

function jiraTest() {
  log.setLevel(logger.Level.FINEST)
  let username = Session.getActiveUser().getEmail()
  let jiraApi = api.createBasic(PropertiesService.getScriptProperties().getProperty('jiraEndpoint'), username, PropertiesService.getScriptProperties().getProperty('jiraToken'))
  let issueService = new JiraIssueService(jiraApi)

  console.log(issueService.getIssue('ACCBILLMON-2', ['io.tempo.jira__account']))
}

function tempoTest() {
  //api.log.setLevel(logger.Level.FINEST)
  log.setLevel(logger.Level.FINEST)
  let username = Session.getActiveUser().getEmail()
  let scriptProps = new prop.ScripPropGetter()
  let jiraApi = api.createBasic(scriptProps.jiraEndpoint, username, scriptProps.jiraToken)
  let tempoApi = api.createBearer(scriptProps.tempoEndpoint, scriptProps.tempoToken)
  let searchService = new TempoWorklogSearchService(tempoApi, jiraApi)

  searchService.bookingsInTimerange(moment().subtract(1, 'week'), moment())
  console.log(searchService.bookingsInTimerange(moment().subtract(1, 'week'), moment()))
}

function bookingsForEventTest() {
  log.setLevel(logger.Level.FINEST)
  let username = Session.getActiveUser().getEmail()
  let scriptProps = new prop.ScripPropGetter()
  let jiraApi = api.createBasic(scriptProps.jiraEndpoint, username, scriptProps.jiraToken)
  let tempoApi = api.createBearer(scriptProps.tempoEndpoint, scriptProps.tempoToken)
  let searchService = new TempoWorklogSearchService(tempoApi, jiraApi)

  searchService.bookingsForEvent({
    startMoment: { format: function t() { return '2023-06-01' } },
    endMoment: { format: function t() { return '2023-06-02' } },
    bookingInfo: { issueKey: 'TDACC-567' },
    title: 'ACT',
    duration: (d) => { return { as: (a) => { return 14400 } } }
  })
  searchService.bookingsForEvent({
    startMoment: { format: function t() { return '2023-06-01' } },
    endMoment: { format: function t() { return '2023-06-03' } },
    bookingInfo: { issueKey: 'TDACC-567' },
    title: 'ACT',
    duration: (d) => { return { as: (a) => { return 14400 } } }
  })
  console.log(searchService.bookingsForEvent({
    startMoment: { format: function t() { return '2023-06-01' } },
    endMoment: { format: function t() { return '2023-06-02' } },
    bookingInfo: { issueKey: 'TDACC-567' },
    title: 'ACT',
    duration: (d) => { return { as: (a) => { return 14400 } } }
  }))
}