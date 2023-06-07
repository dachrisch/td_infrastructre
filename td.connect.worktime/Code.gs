function snapshotTimetracking() {
  let momentFrom = moment('01.06.2022', 'DD.MM.YYYY')
  let momentTo = moment().clone().endOf('year')
  let s = sw.SpreadsheetWrapper.fromActive()
  wt.exportWorktime(momentFrom, momentTo, s)
}
