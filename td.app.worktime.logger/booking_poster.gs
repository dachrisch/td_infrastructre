class TempoBookingWrapperService extends jira.Service {
  static getInstance() {
    return new TempoBookingWrapperService(jiraIssueService())
  }
  constructor(issueService) {
    super()
    this.issueService = issueService
  }

  /**
   * @param {object} tempoBooking
   * @param {String} tempoBooking.self
   * @param {integer} tempoBooking.tempoWorklogId
   * @param {number} tempoBooking.timeSpentSeconds
   * @param {number} tempoBooking.billableSeconds
   * @param {String} tempoBooking.description
   * @param {String} tempoBooking.createdAt
   * @param {String} tempoBooking.updatedAt
   * @param {String} tempoBooking.startDate - "YYYY-MM-DD"
   * @param {String} tempoBooking.startTime - "HH:mm:ss"
   * @param {object} tempoBooking.issue
   * @param {String} tempoBooking.issue.self
   * @param {integer} tempoBooking.issue.id
   * @param {object} tempoBooking.author
   * @param {String} tempoBooking.author.self
   * @param {integer} tempoBooking.author.accountId
   * @param {object} tempoBooking.attributes
   * @param {String} tempoBooking.attributes.self
   * @param {Array} tempoBooking.attributes.values
   */
  fromTempo(tempoBooking) {
    let issueKey = this.issueService.getIssue(tempoBooking.issue.id).key
    let end_time = moment(tempoBooking.start_time, 'HH:mm:ss').add(tempoBooking.timeSpentSeconds, 'seconds')
    return new TempoBookingWrapper(tempoBooking.startDate, tempoBooking.startTime, end_time, tempoBooking.timeSpentSeconds, tempoBooking.billableSeconds, tempoBooking.description, { id: tempoBooking.tempoWorklogId, key: issueKey })
  }
}

class TempoBookingWrapper extends entity.Entity {
  /**
   * @param {String} date - "YYYY-MM-DD"
   * @param {String} start_time- "HH:mm:ss"
   * @param {String} end_time- "HH:mm:ss"
   * @param {number} timeSpentSeconds
   * @param {number} billableSeconds
   * @param {String} comment
   * @param {object} issue
   * @param {integer} issue.id
   * @param {string} issue.key
   */
  constructor(date, start_time, end_time, timeSpentSeconds, billableSeconds, comment, issue) {
    super()
    this.date = date
    this.start_time = start_time
    this.end_time = end_time
    this.timeSpentSeconds = timeSpentSeconds
    this.billableSeconds = billableSeconds
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