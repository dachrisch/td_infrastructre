if ((typeof URI) === 'undefined') {
  eval(UrlFetchApp.fetch('https://rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());
}

const InvalidParameterError = class InvalidParameterError extends Error {
  /**
   * @param {String} parameter - The name of the invalid parameter
   * @param {String} reason - reason why the error was raised
   */
  constructor(parameter, reason) {
    let message = `parameter [${parameter}] is ${reason}`
    super(message)
    this.reason = reason
    this.parameter = parameter;
    this.name = 'InvalidParameterError';
  }
}

/**
 * {String} ticketUrl - ticket to retrieve bookings from (e.g.: https://jira.tdservice.cloud/browse/ABC-123)
 * {String} userEmail - Email of user to obtain bookings from
 * {String} dateInMonth - some date in month (DD.MM.YYYY)
 * @return {Number} - sum of hours of all tickets in given month
 */
function hoursBilledInTicketMonth(ticketUrl, userEmail, dateInMonth, tokenName = 'tempo.token') {
  let tempoToken = UserProperties.getProperty(tokenName)
  if (!tempoToken) {
    throw new InvalidParameterError('tempoToken', 'missing')
  }
  if (!ticketUrl) {
    throw new InvalidParameterError('ticketUrl', 'missing')
  }
  if (!userEmail) {
    throw new InvalidParameterError('userEmail', 'missing')
  }
  if (!dateInMonth) {
    throw new InvalidParameterError('dateInMonth', 'missing')
  }

  try {
    var taskKey = new URI(ticketUrl).filename()
  } catch (e) {
    if (e instanceof TypeError) {
      throw new InvalidParameterError('ticketUrl', 'invalid')
    } else {
      throw e
    }
  }
  return SumServiceConnect.connect(tempoToken, userEmail).tasksDurationInMonth(taskKey, moment(dateInMonth, 'DD.MM.YYYY'))
}

const SumServiceConnect = class SumServiceConnect {
  static connect(tempoToken, userEmail) {
    let billingsService = SingleTaskOtherUserBillingsService.connect(tempoToken, userEmail)
    let sumService = new SumBillingsService(billingsService)
    return new SumServiceConnect(sumService)
  }

  /**
   * {SumBillingsService} sumService
   * {String} taskKey
   * {moment} momentInMonth
   */
  constructor(sumService) {
    this.sumService = sumService
  }

  /**
   * @param {String} taskKey
   * @param {moment} momentInMonth
   * @return {Number}
   */
  tasksDurationInMonth(taskKey, momentInMonth) {
    return this.sumService.getTaskInMonth(taskKey, momentInMonth).duration().as('hours')
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }
}

function test_SumServiceConnect(_test) {
  if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  }
  var test = _test || new GasTap()

  UserProperties.setProperty('test.token', '1234')

  test('all parameter missing', function (t) {
    try {
      hoursBilledInTicketMonth(undefined, undefined, undefined, 'test.token')
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'ticketUrl', 'parameter reporting')
      t.equal(e.reason, 'missing', 'parameter message')
    }
  })


  test('ticketUrl parameter missing', function (t) {
    try {
      hoursBilledInTicketMonth(undefined, 'valid', 'valid', 'test.token')
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'ticketUrl', 'parameter reporting')
      t.equal(e.reason, 'missing', 'parameter message')
    }
  })

  test('userEmail parameter missing', function (t) {
    try {
      hoursBilledInTicketMonth('valid', undefined, 'valid', 'test.token')
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'userEmail', 'parameter reporting')
      t.equal(e.reason, 'missing', 'parameter message')
    }

    try {
      hoursBilledInTicketMonth('valid', '', 'valid', 'test.token')
      t.fail('expected exception')
    } catch (e) {
      if ('parameter' in e) {
        t.equal(e.parameter, 'userEmail', 'parameter reporting')
        t.equal(e.reason, 'missing', 'parameter message')
      } else {
        throw e
      }
    }
  })

  test('dateInMonth parameter missing', function (t) {
    try {
      hoursBilledInTicketMonth('valid', 'valid', undefined, 'test.token')
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'dateInMonth', 'parameter reporting')
      t.equal(e.reason, 'missing', 'parameter message')
    }
  })

  test('ticketUrl parameter valid', function (t) {
    try {
      hoursBilledInTicketMonth(1, 'valid', 'valid', 'test.token')
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'ticketUrl', 'parameter reporting')
      t.equal(e.reason, 'invalid', 'parameter message')
    }
  })

  test('calculate duration of two billings', function (t) {
    SingleTaskOtherUserBillingsService.connect = function (token, email) {
      return new class T {
        getInRangeForTask(fromDate, toDate, taskKey) {
          return [new Billing(moment('01.01.2022 13:00', 'DD.MM.YYYY HH:mm'), moment('01.01.2022 14:00', 'DD.MM.YYYY HH:mm'), 'description', 0, 'billing-key'),
          new Billing(moment('01.01.2022 15:00', 'DD.MM.YYYY HH:mm'), moment('01.01.2022 16:00', 'DD.MM.YYYY HH:mm'), 'description 2', 0, 'billing-key')]
        }
      }
    }
    t.equal(2, hoursBilledInTicketMonth('billing-key', 'valid', 'valid', 'test.token'))
  })

  test.finish()
}
