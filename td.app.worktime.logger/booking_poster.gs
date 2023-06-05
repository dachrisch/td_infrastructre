class TempoBookingWrapperService extends jira.Service {
  static getInstance() {
    return new TempoBookingWrapperService(jiraIssueService())
  }
  constructor(issueService) {
    super()
    this.issueService = issueService
  }
  fromTempo(tempoBooking) {
    let issueKey = this.issueService.getIssue(tempoBooking.issue.id)
    return new TempoBookingWrapper(tempoBooking.startDate, tempoBooking.startTime, tempoBooking.timeSpentSeconds, tempoBooking.billableSeconds, tempoBooking.description, { id: tempoBooking.tempoWorklogId, key: issueKey })
  }
}

class TempoBookingWrapper extends entity.Entity {
  constructor(date, start_time, timeSpentSeconds, billableSeconds, comment, issue) {
    super()
    this.date = date
    this.start_time = start_time
    this.end_time = moment(start_time, 'HH:mm:ss').add(timeSpentSeconds, 'seconds')
    this.comment = comment
    this.issue = issue
    this.billable = billableSeconds > 0
  }
}
function book_selections(selections) {
  return selections.map(selection => {
    let booking = entity.EventWrapper.fromSelection(selection)
    try {
      return TempoBookingWrapperService.getInstance().fromTempo(tempoBookService().book(booking))
    } catch (e) {
      Logger.log(`error while posting [${JSON.stringify(booking)}]: ${e}`)
      throw Error(`error while posting [${JSON.stringify(booking)}]: ${e}`)
    }
  })
}

function connectToTempo() {
  let name = worker().displayName
  console.log(`connected ${name}`)
  return name
}

function store_tempo_token(token) {
  UserProperties.setProperties({ 'tempo_token': token })
}

function tempo_token() {
  return UserProperties.getProperty('tempo_token')
}

function deleteTempoToken() {
  store_tempo_token('')
}