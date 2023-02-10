/**
 * filter to enable custom functions to act on ranges (i.e. ARRAYFORMULAS), which contain empty values
 * @param {(String|Array.<String>)} n - Elements to filter
 */
function emptyElementsFilter(n) {
  return n != null && n != [''] && n != ''
}

Array.prototype.flatten = function (delim, surround) {
  return this.filter(emptyElementsFilter).map(a => `${surround}${a}${surround}`).join(delim)
}

Date.prototype.toJiraDate = function () {
  return `${this.getFullYear()}/${this.getMonth() + 1}/${this.getDate()}`
}

function is1DimArrayformula(array) {
  return array.map && array.length > 0 && array.every(a => a.length == 1)
}