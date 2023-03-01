function test_hoursWorkedOnTicket() {
  console.log(hoursWorkedOnTicket(['HYDAC-2195', 'FRA-1025'], [['s.galdobin@techdivision.com'], ['v.zinsser@techdivision.com']]))
}
function hoursWorkedOnTicket(ticketId, emails) {
  if (!(emails.map && emails.every(e => e.length == 1))) {
    throw `exactly one row of emails allowed, but got: ${emails}`
  }

  if (ticketId.map) {
    return ticketId.filter(emptyElementsFilter).map(t => hoursWorkedOnTicket(t, emails))
  } else {
    let flattenedEmails = emails.filter(emptyElementsFilter).map(e => e[0])

    log.info(`retrieving worked time of [${ticketId}] for user [${flattenedEmails}]`)
    let workhoursRetriever = new api.ApiConnector('https://jira.tdservice.cloud/rest/api/2/issue', ScriptProperties.getProperty('tempo.token'))

    let allWorklogs = workhoursRetriever.on(`${ticketId}/worklog`).fetch().worklogs
    let userWorklogs = allWorklogs.filter(wl => flattenedEmails.includes(wl.author.emailAddress))

    log.fine(`user worked on ${userWorklogs.length} of ${allWorklogs.length} worklogs: ${JSON.stringify(userWorklogs)}`)

    return userWorklogs.reduce((sum, wl) => sum + wl.timeSpentSeconds, 0) / 60 / 60
  }
}
