const RangeWrapper = class RangeWrapper {
  /**
   * @param {SpreadsheetApp.Range} range
   */
  constructor(range, sheetWrapper) {
    this.range = range
    this.sheetWrapper = sheetWrapper
  }

  location() {
    return `${this.range.getSheet().getName()}!${this.range.getA1Notation()}`
  }

  setValuesOneRow(...values) {
    logger.log(`[${this.sheetWrapper.name}] - setting values at [${this.location()}] to [${values}]`)
    if (this.range.getNumRows() != 1) { throw Error(`Only single row ranges allowed: ${this.location()}`) }
    this.range.setValues([values])
    return this
  }

  setValuesOneColumn(...values) {
    logger.log(`[${this.sheetWrapper.name}] - setting values at [${this.location()}] to [${values}]`)
    if (this.range.getNumColumns() != 1) { throw Error(`Only single col ranges allowed: ${this.location()}`) }
    this.range.setValues(values.map(v => [v]))
    return this
  }

  setValuesVariableLength(values) {
    if (this.range.getNumRows() < values.length) { throw Error(`Not enough rows at ${this.location()}: needed ${values.lenght} but only had ${this.range.getNumRows()}`) }
    let subRange = this.range.getSheet().getRange(this.range.getRow(), this.range.getColumn(), values.length, this.range.getNumColumns())
    logger.log(`[${this.sheetWrapper.name}] - setting values at subrange [${subRange.getA1Notation()}] of [${this.location()}] to [${values}]`)
    subRange.setValues(values)
    return this
  }

  /**
   * @param {Array.<Array>} values
   * @return {RangeWrapper} this instance for chaining
   */
  setValues(...values) {
    if (values.every(item => Array.isArray(item))) {
      logger.log(`[${this.sheetWrapper.name}] - setting values at [${this.location()}] to [${values}]`)
      this.range.setValues(...values)
    } else {
      this.setValuesOneRow(values)
    }
    return this
  }

  /**
   * @param {Array.<Array>} values
   * @return {RangeWrapper} this instance for chaining
   */
  appendValues(values) {
    let appendRange = this.range.getSheet().getRange(this.range.getSheet().getLastRow() + 1, this.range.getColumn(), values.length, this.range.getNumColumns())
    logger.log(`[${this.sheetWrapper.name}] - appending to range [${appendRange.getA1Notation()}]: ${values}`)
    appendRange.setValues(values)
    return this
  }

  /**
   * @param {Array.<String>} columnHeader
   * @return {RangeWrapper} this instance for chaining
   */
  setHeader(...columnHeader) {
    this.asHeader()
    return this.setValuesOneRow(...columnHeader)
  }

  asHeader() {
    logger.log(`[${this.sheetWrapper.name}] - setting [${this.location()}] as header`)
    this.range.setTextStyle(headerStyle())
  }

  /**
   * @param {String} name
   * @return {RangeWrapper} this instance for chaining
   */
  setNamedRange(name) {
    logger.log(`[${this.sheetWrapper.name}] - setting named range [${name}] to [${this.range.getA1Notation()}]`)
    SpreadsheetApp.getActiveSpreadsheet().setNamedRange(name, this.range)
    return this
  }

  /**
   * @param {String} formula
   * @return {RangeWrapper} this instance for chaining
   */
  setFormula(formula) {
    logger.log(`[${this.sheetWrapper.name}] - setting [${this.location()}] to [${formula}]`)
    this.range.setFormula(formula)
    return this
  }


  /**
   * 
   * @return {RangeWrapper} this instance for chaining
   */
  asDateTime() {
    this.range.setNumberFormat('dd.mm.yyyy HH:MM')
    return this
  }

  /**
   * 
   * @return {RangeWrapper} this instance for chaining
   */
  asDate() {
    this.range.setNumberFormat('dd.mm.yyyy')
    return this
  }

  /**
   * @param {String} - CSS color string
   * @return {RangeWrapper} this instance for chaining
   */
  withBackground(color) {
    logger.log(`[${this.sheetWrapper.name}] - setting background [${this.location()}] to [${color}]`)
    this.range.setBackground(color)
    return this
  }

  /**
   * 
   * @return {RangeWrapper} this instance for chaining
   */
  requireDate() {
    logger.log(`[${this.sheetWrapper.name}] - required [${this.location()}] to be a date`)
    this.range.setDataValidation(SpreadsheetApp.newDataValidation().requireDate().build())
    return this
  }

  requireHour() {
    logger.log(`[${this.sheetWrapper.name}] - required [${this.location()}] to be an hour (0 - 24)`)
    this.range.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList([...Array(24).keys()]).build())
    return this
  }

  /**
   * 
   * @return {SheetWrapper} the sheet instance for chaining
   */
  and() {
    return this.sheetWrapper
  }

  when() {
    return new WhenConditionWrapper(this.sheetWrapper, this)
  }
}
