var SpreadsheetWrapper=class SpreadsheetWrapper {
  constructor(sheet) {
    this.sheet = sheet
  }

  static fromUrl(url) {
    return new SpreadsheetWrapper(SpreadsheetApp.openByUrl(url))
  }

  getSheet(name) {
    return new SheetWrapper(name, this.sheet.getSheetByName(name))
  }

  singleCellValue(cellId) {
    return this.sheet.getRange(cellId).getValue()
  }

  multiCellValues(cellRange) {
    return this.sheet.getRange(cellRange).getValues().flat().filter(emptyElementsFilter)
  }
}
