const BookingSheetConnector = class BookingSheetConnector {
  constructor(spreadsheet) {
    this.spreadsheet = spreadsheet
    this.bookingValuesNamedRange = 'booking.range'
    this.emailNamedRange = 'booking.email'
  }

  bookingValues() {
    return this.fromNamedRange(this.bookingValuesNamedRange).getValues().map((row) => BookingValue.fromRange(row)).filter((bookingValue) => (bookingValue.shouldBook == true) && bookingValue.hoursToBook > 0.01)
  }

  updateFormulasInBookingRange() {
    let range = this.fromNamedRange(this.bookingValuesNamedRange)
    range.getValues().forEach((row, index) => addFormulaRandomizer(range.getCell(index + 1, 4)))
  }

  userEmail() {
    return this.namedRangeValue(this.emailNamedRange)
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

function addFormulaRandomizer(cell) {
  let currentFormula = cell.getFormula()
  if (currentFormula) {
    let randomString = (Math.random() + 1).toString(36).substring(7);
    let randomizedFormula = currentFormula.replace(/;randomizer_.*\)$/, `;randomizer_${randomString})`)
    if (randomizedFormula != currentFormula) {
      log.fine(`replacing formula in [${cell.getA1Notation()}] with ${randomizedFormula}`)
      cell.setFormula(randomizedFormula)
    }
  }
}
