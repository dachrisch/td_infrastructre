const BookingEntry = class BookingEntry {
  /**
   * @param {String} workerKey
   * @param {moment} startedMoment
   * @param {String} ticketKey
   * @param {Number} hoursToBook
   * @param {String} comment
   */
  constructor(workerKey, startedMoment, ticketKey, hoursToBook, comment) {
    this.timeSpentSeconds = hoursToBook * 60 * 60
    this.attributes = {
      _NotBillable_: {
        name: "Not Billable",
        workAttributeId: 2,
        value: false
      }
    }
    this.billableSeconds = 0
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
  static fromRange(row) {
    return new BookingValue(row[0], row[1], new URI(row[2]), row[4], row[5])
  }
  /**
   * @param {URI} ticketUri
   * @param {Number} hoursToBook
   * @param {Boolean} shouldBook
   */
  constructor(bookingDate, bookingComment, ticketUri, hoursToBook, shouldBook) {
    this.bookingDate = bookingDate
    this.bookingComment = bookingComment
    this.ticketUri = ticketUri
    this.hoursToBook = hoursToBook
    this.shouldBook = shouldBook
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

  ticketKey() {
    return this.ticketUri.filename()
  }

  toEntry(worker) {
    return new BookingEntry(worker, moment(this.bookingDate), this.ticketKey(), this.hoursToBook, this.bookingComment)
  }
}
