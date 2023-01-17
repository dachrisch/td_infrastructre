if ((typeof URI) === 'undefined') {
  eval(UrlFetchApp.fetch('https://rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());
}
const BookingValue = class BookingValue {
  static fromRange(row) {
    return new BookingValue(new URI(row[0]), row[2], row[3])
  }
  /**
   * @param {URI} ticketUri
   * @param {Number} hoursToBook
   * @param {Boolean} shouldBook
   */
  constructor(ticketUri, hoursToBook, shouldBook) {
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
}

function addFormulaRandomizer(cell) {
  let currentFormula = cell.getFormula()
  if (currentFormula) {
    let randomString = (Math.random() + 1).toString(36).substring(7);
    let randomizedFormula = currentFormula.replace(/;randomizer_.*\)$/, `;randomizer_${randomString})`)
    if (randomizedFormula != currentFormula) {
      console.log(`replacing formula in [${cell.getA1Notation()}] with ${randomizedFormula}`)
      cell.setFormula(randomizedFormula)
    }
  }
}

const BookingSheetConnector = class BookingSheetConnector {
  constructor(spreadsheet) {
    this.spreadsheet = spreadsheet
    this.dateInMonthNamedRange = 'date.in.month'
    this.bookingValuesNamedRange = 'booking.range'
    this.emailNamedRange = 'booking.email'
    this.commentNamedRange = 'booking.comment'
  }

  bookingMonthMoment() {
    return moment(this.spreadsheet.getRangeByName(this.dateInMonthNamedRange).getValue())
  }

  bookingValues() {
    return this.fromNamedRange(this.bookingValuesNamedRange).getValues().map((row) => BookingValue.fromRange(row)).filter((bookingValue) => (bookingValue.shouldBook == true) && bookingValue.hoursToBook > 0.01)
  }

  updateFormulasInBookingRange() {
    let range = this.fromNamedRange(this.bookingValuesNamedRange)
    range.getValues().forEach((row, index) => addFormulaRandomizer(range.getCell(index + 1, 2)))
  }

  updateFormulasInActiveSheet() {
    let thisSheet = this.spreadsheet.getActiveSheet()
    let maxRows = Math.min(40, thisSheet.getMaxRows())
    let maxCols = Math.min(30, thisSheet.getMaxColumns())

    for (var currentCol = 1; currentCol < maxCols; currentCol++) {
      for (var currentRow = 1; currentRow < maxRows; currentRow++) {
        let thisRange = thisSheet.getRange(currentRow, currentCol)
        addFormulaRandomizer(thisRange.getCell(1, 1))
      }
    }

  }

  userEmail() {
    return this.namedRangeValue(this.emailNamedRange)
  }

  bookingComment() {
    return this.namedRangeValue(this.commentNamedRange)
  }

  namedRangeValue(rangeName) {
    return this.fromNamedRange(rangeName).getValue()
  }

  fromNamedRange(rangeName) {
    let namedRange = this.spreadsheet.getRangeByName(rangeName)
    if (!namedRange) {
      throw new InvalidParameterError(rangeName, 'not found')
    }
    return namedRange
  }

}

function bookBillingsInMonth() {
  let token = authenticate()
  let sheetConnector = new BookingSheetConnector(SpreadsheetApp.getActiveSpreadsheet())
  let bookingService = new BookingService(new ApiConnector('https://jira.tdservice.cloud/rest/tempo-timesheets/4/worklogs', token), OtherIdentityService.connect(token, sheetConnector.userEmail()))

  sheetConnector.bookingValues().forEach((bookingValue) => bookingService.bookEntry(bookingValue, sheetConnector.bookingMonthMoment(), sheetConnector.bookingComment()))

  sheetConnector.updateFormulasInBookingRange()
}

function authenticate() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt("Please enter tempo token");
  var button = result.getSelectedButton();

  if (button === ui.Button.OK) {
    let tempoToken = result.getResponseText()
    return tempoToken
  } else if (button === ui.Button.CLOSE) {
    throw new Error('not authenticated')
  }
}


