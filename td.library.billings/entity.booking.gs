const BookingEntry = class BookingEntry {
  /**
   * @param {String} workerKey
   * @param {moment} startedMoment
   * @param {String} ticketKey
   * @param {Number} hoursToBook
   * @param {String} comment
   */
  constructor(workerKey, startedMoment, ticketKey, hoursToBook, comment, accountKey = 'TD') {
    this.timeSpentSeconds = hoursToBook * 60 * 60
    this.attributes = {
      _NotBillable_: {
        name: "Not Billable",
        workAttributeId: 2,
        value: false
      },
      _Account_: {
        name: "Account",
        workAttributeId: 7,
        value: accountKey
      }
    }

    this.billableSeconds = this.timeSpentSeconds
    this.worker = workerKey
    this.comment = comment
    this.started = startedMoment.format('YYYY-MM-DD HH:mm:ss.SSS')
    this.originTaskId = ticketKey
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}

const BookedEntry = class BookedEntry {
  static fromJson(jsonValues) {
    return new BookedEntry(jsonValues.tempoWorklogId, jsonValues.worker, jsonValues.started, jsonValues.issue.key, jsonValues.timeSpentSeconds / (60 * 60), jsonValues.comment)
  }

  constructor(entryId, workerKey, startedDate, ticketKey, bookedHours, comment) {
    this.entryId = entryId
    this.workerKey = workerKey
    this.startedDate = startedDate
    this.ticketKey = ticketKey
    this.bookedHours = bookedHours
    this.comment = comment
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}

const BookingValue = class BookingValue {

  static EMPTY() {
    return new BookingValue('00.00.0000', '', '', 0, '00:00', '00:00', false)
  }
  /**
   * @param {String} bookingDate - date of booking (DD.MM.YYYY)
   * @param {String} bookingComment - comment for booking
   * @param {URI} ticketUri
   * @param {String} workerId
   * @param {String} startTime (HH:mm)
   * @param {String} endTime (HH:mm)
   * @param {Boolean} shouldBook
   */
  constructor(bookingDate, bookingComment, ticketUri, workerId, startTime, endTime, shouldBook) {
    this.bookingDate = bookingDate
    this.bookingComment = bookingComment
    this.ticketUri = ticketUri
    this.startTimeMoment = moment(startTime, 'HH:mm')
    this.endTime = endTime
    this.shouldBook = shouldBook
    this.workerId = workerId
    log.finer(this.toString())
  }

  bookable() {
    return this.shouldBook && this.hoursToBook() > 0.01
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

  ticketKey() {
    return this.ticketUri.filename()
  }

  hoursToBook() {
    return moment.duration(moment(this.endTime, 'HH:mm').diff(this.startTimeMoment)).as('hours')
  }

  toEntry(accountKey) {
    let startMoment = moment(this.bookingDate, 'DD.MM.YYYY').hours(this.startTimeMoment.hours()).minutes(this.startTimeMoment.minutes())
    return new BookingEntry(this.workerId, startMoment, this.ticketKey(), this.hoursToBook(), this.bookingComment, accountKey)
  }
}
