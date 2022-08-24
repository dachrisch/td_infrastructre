class RangeWrapper {
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

  /**
   * @param {Array.<Array>} values
   * @return {RangeWrapper} this instance for chaining
   */
  setValues(...values) {
    console.log(`[${this.sheetWrapper.name}] - setting values at [${this.location()}] to [${values}]`)
    if (values.every(item => Array.isArray(item))) {
      this.range.setValues(values)
    } else {
      this.range.setValues([values])
    }
    return this
  }

  /**
   * @param {Array.<Array>} values
   * @return {RangeWrapper} this instance for chaining
   */
  appendValues(values) {
    let appendRange = this.range.getSheet().getRange(this.range.getSheet().getLastRow() + 1, this.range.getColumn(), values.length, this.range.getNumColumns())
    console.log(`[${this.sheetWrapper.name}] - appending to range [${appendRange.getA1Notation()}]: ${values}`)
    appendRange.setValues(values)
    return this
  }

  /**
   * @param {Array.<String>} columnHeader
   * @return {RangeWrapper} this instance for chaining
   */
  setHeader(...columnHeader) {
    console.log(`[${this.sheetWrapper.name}] - setting [${this.location()}] as header`)
    this.range.setTextStyle(headerStyle())
    return this.setValues(columnHeader)
  }

  /**
   * @param {String} name
   * @return {RangeWrapper} this instance for chaining
   */
  setNamedRange(name) {
    console.log(`[${this.sheetWrapper.name}] - setting named range [${name}] to [${this.range.getA1Notation()}]`)
    SpreadsheetApp.getActiveSpreadsheet().setNamedRange(name, this.range)
    return this
  }

  /**
   * @param {String} formula
   * @return {RangeWrapper} this instance for chaining
   */
  setFormula(formula) {
    console.log(`[${this.sheetWrapper.name}] - setting [${this.location()}] to [${formula}]`)
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
    console.log(`[${this.sheetWrapper.name}] - setting background [${this.location()}] to [${color}]`)
    this.range.setBackground(color)
    return this
  }

  /**
   * 
   * @return {RangeWrapper} this instance for chaining
   */
  requireDate() {
    console.log(`[${this.sheetWrapper.name}] - required [${this.location()}] to be a date`)
    this.range.setDataValidation(SpreadsheetApp.newDataValidation().requireDate().build())
    return this
  }

  requireHour() {
    console.log(`[${this.sheetWrapper.name}] - required [${this.location()}] to be an hour (0 - 24)`)
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
}
