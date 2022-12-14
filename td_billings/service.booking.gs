const BookingEntry = class BookingEntry {
  /**
   * @param {String} workeyKey
   * @param {moment} startedDate
   * @param {String} ticketKey
   * @apram {String} comment
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
    this.entryId=entryId
    this.workerKey = workerKey
    this.startedDate = startedDate
    this.ticketKey = ticketKey
    this.bookedHours = bookedHours
    this.comment=comment
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}

const BookingService = class BookingService {
  /**
   * @param {ApiConnector} tempoApiConnector
   * @param {IdentityService} identityService
   */
  constructor(tempoApiConnector, identityService) {
    this.tempoApiConnector = tempoApiConnector
    this.identityService = identityService
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

  /**
   * @param {BookingValue} bookingValue
   * @param {moment} bookingMoment
   * @param {String} bookingComment
   */
  bookEntry(bookingValue, bookingMoment, bookingComment) {
    let bookingEntry = new BookingEntry(this.identityService.workerKey(), bookingMoment, bookingValue.ticketKey(), bookingValue.hoursToBook, bookingComment)
    console.log(`booking ${bookingValue} as ${bookingEntry}`)
    let bookedEntry = BookedEntry.fromJson(this.tempoApiConnector.post(bookingEntry)[0])
    console.log(`booked entry ${bookedEntry}`)
    return bookedEntry
  }
}

function test_BookingService(_test) {
  if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  }
  var test = _test || new GasTap()

  test('book entry', function (t) {
    let worker = 'worker-A'
    let momentToBook = moment('02.09.2022', 'DD.MM.YYYY')
    let summary='this is a test booking'
    let bookingService = new BookingService(new class A {
      post(bookingEntry) {
        return [{
          billableSeconds: bookingEntry.billableSeconds,
          tempoWorklogId: 123456,
          timeSpentSeconds: bookingEntry.timeSpentSeconds,
          issue:
          {
            key: bookingEntry.originTaskId,
          },
          comment: bookingEntry.comment,
          attributes: bookingEntry.attributes,
          worker: bookingEntry.worker,
          started: bookingEntry.started
        }]
      }
    }, new class I {
      workerKey() {
        return worker
      }
    })
    let bookingValue = new BookingValue(new URI('https://jira.tdservice.cloud/browse/ABC-123'), 2, true)
    let bookedEntry = bookingService.bookEntry(bookingValue, momentToBook, summary)
    t.equal(bookedEntry.bookedHours, bookingValue.hoursToBook, 'booked hours match')
    t.equal(bookedEntry.startedDate, momentToBook.format('YYYY-MM-DD HH:mm:ss.SSS'), 'started time matches')
    t.equal(bookedEntry.ticketKey, bookingValue.ticketKey(), 'booking ticket matches')
    t.equal(bookedEntry.workerKey, worker, 'worker key matches')
    t.equal(bookedEntry.comment, summary, 'comment matches')
    t.equal(bookedEntry.entryId, 123456, 'id matches')

  })
}


