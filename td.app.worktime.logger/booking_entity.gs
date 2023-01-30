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
    let booking_info = element.booking_info || new bookingInfo()
    
    return new tempoBooking(start_date, duration, element.summary, booking_info)
  }

  constructor(start_date, duration, summary, booking_info, worker_key) {
    this.start_date = start_date
    this.duration = duration
    this.summary = summary
    this.booking_info = booking_info
    this.worker_key = worker_key
  }

  toPayloadJson() {
    // XXX: Tempo Api doesn't recognizes timezones
    // https://tempo-io.atlassian.net/wiki/spaces/KB/pages/232816644/Why+is+there+a+time+difference+between+my+Jira+worklog+and+my+Tempo+worklog
    let json_start_time = new Date(this.start_date.getTime() + 60 * 60000)
    let billingDuration = (this.booking_info.hour_factor * this.duration).toFixed()
    let payload = {
      attributes: {
        _NotBillable_: {
          name: "Not Billable",
          workAttributeId: 2,
          value: !this.booking_info.billable
        }
      },
      billableSeconds: this.booking_info.billable && billingDuration || 0,
      remainingEstimate: 0,
      worker: this.worker_key,
      comment: this.summary,
      started: json_start_time.toJSON(),
      timeSpentSeconds: this.duration,
      originTaskId: this.booking_info.issue_id
    }

    if(this.booking_info.account_name) {
      payload.attributes._Account_ = {
        name:"Account",
        workAttributeId:7,
        value:this.booking_info.account_name
      }
    }

    return payload
  }
}

