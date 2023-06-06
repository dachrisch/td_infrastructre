/**
 * @param {Object} JSON element
 * @param {String} JIRA Ticket
 * @return {tempoBooking}
 */
class tempoBooking {
  static fromElement(element) {
    let date_parts = element.date.split('.')
    let time_parts_start = element.start_time.split(':')
    let time_parts_end = element.end_time.split(':')
    let start_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0], time_parts_start[0], time_parts_start[1])
    let end_date = new Date(start_date)
    end_date.setHours(time_parts_end[0])
    end_date.setMinutes(time_parts_end[1])
    let duration = (end_date - start_date) / 1000
    let booking_info = element.booking_info || new BookingInfo()

    return new tempoBooking(start_date, duration, element.summary, booking_info)
  }

  constructor(start_date, duration, summary, booking_info, worker_key) {
    this.start_date = start_date
    this.duration = duration
    this.summary = summary
    this.booking_info = booking_info
    this.worker_key = worker_key
  }
}

class TempoBookingWrapperService extends jira.Service {
  static getInstance() {
    if (!('instance' in TempoBookingWrapperService)) {
      TempoBookingWrapperService.instance = new TempoBookingWrapperService(jiraIssueService())
    }
    return TempoBookingWrapperService.instance
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
    let l = this.issueService
    let issueKey = this.issueService.getIssue(tempoBooking.issue.id).key
    let end_time = moment(tempoBooking.startTime, 'HH:mm:ss').add(tempoBooking.timeSpentSeconds, 'seconds').format('HH:mm:ss')
    return new TempoBookingWrapper(tempoBooking.startDate,
      tempoBooking.startTime,
      end_time,
      tempoBooking.timeSpentSeconds,
      tempoBooking.billableSeconds,
      tempoBooking.description,
      issueKey,
      tempoBooking.tempoWorklogId,
      tempoBooking.attributes.values)
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
   * @param {string} issueKey
   * @param {integer} worklogId
   * @param {object} attributes
   */
  constructor(date, start_time, end_time, timeSpentSeconds, billableSeconds, comment, issueKey, worklogId, attributes) {
    super()
    this.date = date
    this.start_time = start_time
    this.end_time = end_time
    this.timeSpentSeconds = timeSpentSeconds
    this.billableSeconds = billableSeconds
    this.comment = comment
    this.issueKey = issueKey
    this.worklogId = worklogId
    this.attributes = attributes
    this.billable = billableSeconds > 0
  }
}
