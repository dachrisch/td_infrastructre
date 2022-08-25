class ChartBuilderWrapper {
  /**
   * @param {SpreadsheetApp.Sheet} sheet
   * @param {String} chartName
   * 
   */
  constructor(sheet, chartName) {
    this.sheet = sheet
    this.chartName = chartName
    this.chartBuilder = this.sheet.newChart()
    this.chartBuilder.setOption('title', chartName)
    logger.log(`creating new chart [${this.chartName}]`)
  }

  /**
   * {SpreadsheetApp.ChartType} chartType
   */
  setChartType(chartType) {
    this.chartBuilder.setChartType(chartType)
    logger.log(`[chart(${this.chartName})] - chart Type ${chartType}`)
    return this
  }
  setPosition(...coordinates) {
    this.chartBuilder.setPosition(...coordinates)
    logger.log(`[chart(${this.chartName})] - position ${coordinates}`)
    return this
  }
  addRange(range_A1, stacked = false) {
    logger.log(`[chart(${this.chartName})] - adding range ${range_A1}`)
    this.chartBuilder.addRange(this.sheet.getRange(range_A1))
    let series_index = this.chartBuilder.getRanges().length - 1
    logger.log(`[chart(${this.chartName})] - 'isStacked' = ${stacked}`)
    this.chartBuilder.setOption('isStacked', stacked)
    return this
  }

  setNumHeaders(num) {
    logger.log(`[chart(${this.chartName})] - number of header ${num}`)
    this.chartBuilder.setNumHeaders(num)
    return this
  }

  build() {
    let chart = this.chartBuilder.build()
    logger.info(`[chart(${this.chartName})] - adding to sheet [${this.sheet.getName()}]`)
    this.sheet.insertChart(chart)
  }
}
