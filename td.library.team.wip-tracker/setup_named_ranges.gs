function teamFilterId() {
  return sw.SpreadsheetWrapper.fromActive().singleCellValue('team_filter_id')
}


function workingColumns() {
  return sw.SpreadsheetWrapper.fromActive().multiCellValues('working_columns')
}
