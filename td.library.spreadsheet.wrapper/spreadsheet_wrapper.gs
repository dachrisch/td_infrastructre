var SpreadsheetWrapper = class SpreadsheetWrapper {
  /**
   * @param {SpreadsheetApp.Spreadsheet} spreadsheet
   */
  constructor(spreadsheet) {
    this.spreadsheet = spreadsheet
    SpreadsheetApp.setActiveSpreadsheet(spreadsheet)
  }

  static fromUrl(url) {
    return new SpreadsheetWrapper(SpreadsheetApp.openByUrl(url))
  }

  static fromActive() {
    return new SpreadsheetWrapper(SpreadsheetApp.getActiveSpreadsheet())
  }

  /**
   * tries to get the sheet by name, if not found, return empty
   * @param {String} name - name of sheet in spreadsheet
   * @return {SheetWrapper}
   */
  getSheet(name) {
    let sheet =  this.spreadsheet.getSheetByName(name)
    logger.info(`getting sheet [${name}]: ${sheet.getSheetId()}`)
    return new SheetWrapper(name, sheet)
  }

  /**
   * create or get the sheet by name
   * @param {String} name - name of sheet in spreadsheet or to be created
   * @return {SheetWrapper}
   */
  createOrGetSheet(name) {
    let wrappedSheet = this.getSheet(name)
    if (!wrappedSheet.exists()) {
      let newSheet = this.spreadsheet.insertSheet(name)
      logger.info(`creating sheet [${name}]: ${newSheet.getSheetId()}`)
      wrappedSheet = new SheetWrapper(name, newSheet)
    }
    return wrappedSheet
  }

  singleCellValue(cellId) {
    return this.spreadsheet.getRange(cellId).getValue()
  }

  multiCellValues(cellRange) {
    return this.spreadsheet.getRange(cellRange).getValues().flat().filter(emptyElementsFilter)
  }
}

/**
 * filter to enable custom functions to act on ranges (i.e. ARRAYFORMULAS), which contain empty values
 * @param {(String|Array.<String>)} n - Elements to filter
 */
function emptyElementsFilter(n) {
  return n != null && n != [''] && n != ''
}
