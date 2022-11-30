function headerStyle() {
  return SpreadsheetApp.newTextStyle().setBold(true).build()
}

const SheetWrapper = class SheetWrapper {
  /**
   * @param {String} name
   * @param {SpreadsheetApp.Sheet} sheet
   */
  constructor(name, sheet) {
    this.name = name
    this.sheet = sheet
  }

  clear() {
    this.sheet.clear()
    return this
  }

  /**
   * @param {String} range_A1
   * @return {RangeWrapper}
   */
  on(range_A1) {
    return new RangeWrapper(this.sheet.getRange(range_A1), this)
  }

  move(position) {
    logger.log(`moving [${this.name}] to position ${position}`)
    SpreadsheetApp.setActiveSheet(this.sheet)
    SpreadsheetApp.getActiveSpreadsheet().moveActiveSheet(position)
    return this
  }

  protect() {
    logger.log(`protecting [${this.name}]`)
    this.sheet.protect().setDescription('Automatic Calculations. Do not Edit!').setWarningOnly(true)
    return this
  }

  remove() {
    if (this.sheet) {
      logger.log(`removing [${this.name}]`)
      SpreadsheetApp.getActiveSpreadsheet().deleteSheet(this.sheet)
    } else {
      logger.log(`[${this.name}] does not exists`)
    }
  }

  exists() {
    return null != this.sheet
  }

  /** 
   * @param {String} name - Retrieve sheet with this name
   * @return {SheetWrapper}
   * 
   */
  static getSheet(name) {
    return new SheetWrapper(name, SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name))
  }
  /**
   * @param {String} name - Insert or retrieve sheet with this name
   * @return {SheetWrapper}
   */
  static createOrGetSheet(name) {
    let wrappedSheet = SheetWrapper.getSheet(name)
    if (!wrappedSheet.exists()) {
      let newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(name)
      logger.info(`creating sheet [${name}]: ${newSheet.getSheetId()}`)
      wrappedSheet = new SheetWrapper(name, newSheet)
    }
    return wrappedSheet
  }

  newChart(chartName) {
    return new ChartBuilderWrapper(this.sheet, chartName)
  }

  toString() {
    if (this.sheet) {
      return `SheetWrapper(${this.name}, ${this.sheet.getSheetId()})`

    } else { return `SheetWrapper(${this.name}, missing)` }
  }

  appendConditionalFormatRule(rule) {
    let rules = this.sheet.getConditionalFormatRules()
    rules.push(rule.build())
    this.sheet.setConditionalFormatRules(rules)

  }
}
