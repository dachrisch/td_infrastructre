function updateKA() {
  bookKALastMonth()
  deleteKAFuture()
  bookKAIntoFuture2Month()
}

function bookKALastMonth() {
  let now = moment()
  let then = now.clone().subtract(1, 'month')
  let googleCalendar = new cWrap.CalendarAppWrapper()

  bookWorklogs(then, now, googleCalendar.all(), kaEventsFilter)
}

/**
 * @typedef {{tempoWorklogId:Number,description:string}} booking
 */
function deleteKAFuture() {
  const now = moment().add(1, 'days').startOf('day')
  const then = now.clone().add(2, 'month')

  const username = Session.getActiveUser().getEmail()
  const jiraApi = api.createBasic(scriptProperty('jiraEndpoint'), username, scriptProperty('jiraToken'))
  const tempoApi = api.createBearer(scriptProperty('tempoEndpoint'), scriptProperty('tempoToken'))

  const worklogsSearchService = new jira.TempoWorklogSearchService(tempoApi, jiraApi)
  const worklogsDeleteService = new jira.TempoWorklogDeleteService(tempoApi, jiraApi)

  log.info(`deleting KA bookings from [${now}] to [${then}]`)
  worklogsSearchService.bookingsInTimerange(now, then).filter(kaBookingsFilter).forEach((booking) => {
    worklogsDeleteService.delete(booking.tempoWorklogId)
  })
}

function bookKAIntoFuture2Month() {
  let now = moment()
  let then = now.clone().add(2, 'month')
  let googleCalendar = new cWrap.CalendarAppWrapper()

  bookWorklogs(now, then, googleCalendar.all(), kaEventsFilter)
}
