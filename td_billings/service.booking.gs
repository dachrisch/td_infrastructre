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
   */
  bookEntry(bookingValue) {
    let bookingEntry = bookingValue.toEntry(this.identityService.workerKey())
    log.info(`booking ${bookingEntry}`)
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
    let summary = 'this is a test booking'
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


