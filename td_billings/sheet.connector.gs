eval(UrlFetchApp.fetch('https://rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());

const InvalidParameterError = class InvalidParameterError extends Error {
  constructor(parameter, reason) {
    let message = `parameter [${parameter}] is ${reason}`
    super(message)
    this.reason = reason
    this.parameter = parameter;
    this.name = 'InvalidParameterError';
  }
}

function hoursBilledInTicketMonth(tempoToken, ticketUrl, userEmail, dateInMonth) {
  if (tempoToken == undefined) {
    throw new InvalidParameterError('tempoToken', 'missing')
  }
  if (ticketUrl == undefined) {
    throw new InvalidParameterError('ticketUrl', 'missing')
  }
  if (userEmail == undefined) {
    throw new InvalidParameterError('userEmail', 'missing')
  }
  if (dateInMonth == undefined) {
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
  let billingsService = SingleTaskOtherUserBillingsService.connect(tempoToken, userEmail)
  let sumService = new SumBillingsService(billingsService)
  return new SheetConnect(sumService, taskKey, moment(dateInMonth, 'DD.MM.YYYY'))
}

const SheetConnect = class SheetConnect {

  /**
   * {SumBillingsService} sumService
   * {String} taskKey
   * {moment} momentInMonth
   */
  constructor(sumService, taskKey, momentInMonth) {
    this.sumService = sumService
    this.taskKey = taskKey
    this.momentInMonth = momentInMonth
  }

  /**
   * @return {Number}
   */
  execute() {
    return this.sumService.getTaskInMonth(this.taskKey, this.momentInMonth).duration().as('hours')
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }
}

function test_SheetConnector(_test) {
  if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  }
  var test = _test || new GasTap()

  test('all parameter missing', function (t) {
    try {
      hoursBilledInTicketMonth()
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'tempoToken', 'parameter reporting')
      t.equal(e.reason, 'missing', 'parameter message')
    }
  })

  test('tempoToken parameter missing', function (t) {
    try {
      hoursBilledInTicketMonth(undefined, 'valid', 'valid', 'valid')
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'tempoToken', 'parameter reporting')
      t.equal(e.reason, 'missing', 'parameter message')
    }
  })

  test('ticketUrl parameter missing', function (t) {
    try {
      hoursBilledInTicketMonth('valid', undefined, 'valid', 'valid')
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'ticketUrl', 'parameter reporting')
      t.equal(e.reason, 'missing', 'parameter message')
    }
  })

  test('userEmail parameter missing', function (t) {
    try {
      hoursBilledInTicketMonth('valid', 'valid', undefined, 'valid')
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'userEmail', 'parameter reporting')
      t.equal(e.reason, 'missing', 'parameter message')
    }
  })

  test('dateInMonth parameter missing', function (t) {
    try {
      hoursBilledInTicketMonth('valid', 'valid', 'valid', undefined)
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'dateInMonth', 'parameter reporting')
      t.equal(e.reason, 'missing', 'parameter message')
    }
  })

  test('ticketUrl parameter valid', function (t) {
    try {
      hoursBilledInTicketMonth('valid', 1, 'valid', 'valid')
      t.fail('expected exception')
    } catch (e) {
      t.equal(e.parameter, 'ticketUrl', 'parameter reporting')
      t.equal(e.reason, 'invalid', 'parameter message')
    }
  })

  test.finish()
}
