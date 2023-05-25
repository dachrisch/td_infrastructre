const AccountService = class AccountService {
  static create(token) {
    return new AccountService(new api.createBearer('https://jira.tdservice.cloud/rest/api/2/issue', token))
  }
  constructor(tempoApiConnector) {
    this.tempoApiConnector = tempoApiConnector
  }

  accountKey(ticketKey) {
    let accountKeyField = this.tempoApiConnector.on(ticketKey).fetch().fields.customfield_11400
    return accountKeyField == undefined ? 'TD' : accountKeyField.key
  }

}

const BookingService = class BookingService {
  static create(token) {
    return new BookingService(new api.createBearer('https://jira.tdservice.cloud/rest/tempo-timesheets/4/worklogs', token),
      AccountService.create(token))
  }
  /**
   * @param {ApiConnector} tempoApiConnector
   * @param {IdentityService} identityService
   */
  constructor(tempoApiConnector, accountService) {
    this.tempoApiConnector = tempoApiConnector
    this.accountService = accountService
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

  /**
   * @param {BookingValue} bookingValue
   */
  bookEntry(bookingValue) {
    let bookingEntry = bookingValue.toEntry(this.accountService.accountKey(bookingValue.ticketKey()))
    log.info(`booking ${bookingEntry}`)
    let bookedEntry = this.tempoApiConnector.post(bookingEntry).map(BookedEntry.fromJson)[0]
    log.fine(`booked entry ${bookedEntry}`)
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
    let bookingValue = new BookingValue('02.09.2022', summary, new URI('https://jira.tdservice.cloud/browse/ABC-123'), worker, '00:00', '09:30', true)
    let bookedEntry = bookingService.bookEntry(bookingValue)
    t.equal(bookedEntry.bookedHours, bookingValue.hoursToBook(), 'booked hours match')
    t.equal(bookedEntry.startedDate, momentToBook.format('YYYY-MM-DD HH:mm:ss.SSS'), 'started time matches')
    t.equal(bookedEntry.ticketKey, bookingValue.ticketKey(), 'booking ticket matches')
    t.equal(bookedEntry.workerKey, worker, 'worker key matches')
    t.equal(bookedEntry.comment, summary, 'comment matches')
    t.equal(bookedEntry.entryId, 123456, 'id matches')

  })
  test.finish()
}


