const NamedRangeRetriever = class NamedRangeRetriever {
  constructor(spreadsheet, rangeName) {
    this.spreadsheet=spreadsheet
    this.rangeName = rangeName
  }

  values() {
    return this.range().getValues()
  }

  value() {
    return this.range().getValue()
  }

  range() {
    return this.fromNamedRange(this.rangeName)
  }

  fromNamedRange(rangeName) {
    let namedRange = this.spreadsheet.getRangeByName(rangeName)
    if (!namedRange) {
      throw new InvalidParameterError(rangeName, 'not found')
    }
    log.finer(`${rangeName} is ${namedRange.getA1Notation()}`)
    return namedRange
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }
}

const BookingSheetConnector = class BookingSheetConnector {
  constructor(bookingValuesRetriever, rowToValueMapper) {
    this.rowToValueMapper = rowToValueMapper
    this.bookingValuesRetriever = bookingValuesRetriever
    log.fine(`connecting to ${this}`)
  }

  bookingValues() {
    return this.bookingValuesRetriever.values().map((row) => this.rowToValueMapper.map(row)).filter((bookingValue) => (bookingValue.bookable() == true))
  }

  updateFormulasInBookingRange() {
    log.info(`updating formulae in ${this.bookingValuesRetriever}`)
    let range = this.bookingValuesRetriever.range()
    let cellsWithRandomizer = []
    for(let i=1;i<range.getNumRows();i++) {
      for(let j=1;j<range.getNumColumns();j++) {
        let cell = range.getCell(i,j)
        if(cell.isBlank()) {
          break
        }
        if(cell.getFormula().includes(';randomizer_')) {
          cellsWithRandomizer.push(cell)
        }
      }
    }
    cellsWithRandomizer.forEach(cell => addFormulaRandomizer(cell))
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
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
