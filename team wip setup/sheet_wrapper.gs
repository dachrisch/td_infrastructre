
function singleCellValue(cellId) {
  return SpreadsheetApp.getActiveSpreadsheet().getRange(cellId).getValue()
}

function multiCellValues(cellRange) {
  return SpreadsheetApp.getActiveSpreadsheet().getRange(cellRange).getValues().flat().filter(emptyElementsFilter)
}

function headerStyle() {
  return SpreadsheetApp.newTextStyle().setBold(true).build()
}

class SheetWrapper {
  /**
   * @param {String} name
   * @param {SpreadsheetApp.Sheet} sheet
   */
  constructor(name, sheet) {
    this.name=name
    this.sheet = sheet
  }

  /**
   * @param {String} range_A1
   * @return {RangeWrapper}
   */
  on(range_A1) {
    return new RangeWrapper(this.sheet.getRange(range_A1), this)
  }

  remove() {
    if (this.sheet) {
      console.log(`removing [${this.name}]`)
      SpreadsheetApp.getActiveSpreadsheet().deleteSheet(this.sheet)
    }else{
      console.log(`[${this.name}] does not exists`)
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
      console.log(`creating sheet [${name}]: ${newSheet.getSheetId()}`)
      wrappedSheet = new SheetWrapper(name, newSheet)
    }
    return wrappedSheet
  }

  newChart(chartName) {
    return new ChartBuilderWrapper(this.sheet, chartName)
  }
}
class ChartBuilderWrapper {
  /**
   * @param {SpreadsheetApp.Sheet} sheet
   * @param {String} chartName
   * 
   */
  constructor(sheet,chartName) {
    this.sheet=sheet
    this.chartName=chartName
    this.chartBuilder=this.sheet.newChart()
    this.chartBuilder.setOption('title', chartName)
    console.log(`creating new chart [${this.chartName}]`)
  }

  setChartType(chartType) {
    this.chartBuilder.setChartType(chartType)
    console.log(`[${this.chartName}] - chart Type ${chartType}`)
    return this
  }
  setPosition(...coordinates) {
    this.chartBuilder.setPosition(...coordinates)
    console.log(`[${this.chartName}] - position ${coordinates}`)
    return this
  }
  addRange(range_A1, stacked=false) {
    console.log(`[${this.chartName}] - adding range ${range_A1}`)
    this.chartBuilder.addRange(this.sheet.getRange(range_A1))
    let series_index = this.chartBuilder.getRanges().length - 1
    console.log(`[${this.chartName}] - 'isStacked' = ${stacked}`)
    this.chartBuilder.setOption('isStacked', stacked)
    return this
  }

  setNumHeaders(num) {
    console.log(`[${this.chartName}] - number of header ${num}`)
    this.chartBuilder.setNumHeaders(num)
    return this
  }
  build() {
    let chart=this.chartBuilder.build()
    console.log(`[${this.chartName}] - adding to sheet ${this.sheet.getName()}`)
    this.sheet.insertChart(chart)
  }
}