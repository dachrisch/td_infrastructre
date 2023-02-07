const WhenConditionWrapper = class WhenConditionWrapper {
  /**
   * @param {SheetWrapper} sheetWrapper
   * @param {RangeWrapper} rangeWrapper
   */
  constructor(sheetWrapper, rangeWrapper) {
    this.sheetWrapper = sheetWrapper
    this.rangeWrapper = rangeWrapper
    this.rule = SpreadsheetApp.newConditionalFormatRule()
    this.rule.setRanges([rangeWrapper.range])
  }

  aboveEqual(value) {
    this.rule.whenNumberGreaterThanOrEqualTo(value)
    return new ThenConditionWrapper(this.sheetWrapper, this.rangeWrapper, this.rule)
  }
  below(value) {
    this.rule.whenNumberLessThan(value)
    return new ThenConditionWrapper(this.sheetWrapper, this.rangeWrapper, this.rule)
  }
}

const ThenConditionWrapper = class ThenConditionWrapper {
  /**
   * @param {SheetWrapper} sheetWrapper
   * @param {RangeWrapper} rangeWrapper
   * @param {SpreadsheetApp.ConditionalFormatRuleBuilder} rule
   */
  constructor(sheetWrapper, rangeWrapper, rule) {
    this.sheetWrapper = sheetWrapper
    this.rangeWrapper = rangeWrapper
    this.rule = rule
  }

  background(color) {
    this.rule.setBackground(color)
    return this
  }

  /**
   * build the rule and apply it to sheet
   * @return {RangeWrapper}
   */
  build() {
    this.sheetWrapper.appendConditionalFormatRule(this.rule)
    return this.rangeWrapper
  }
}
