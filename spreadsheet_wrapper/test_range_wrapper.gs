if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
} // Class GasTap is ready for use now!


function rangeTestRunner(_test) {
  var test = _test || new GasTap()

  let s = SpreadsheetApp.create('rangeWrapperTestSheet')
  let sw = new SheetWrapper('test', s)

  s.getActiveSheet().clear()
  test('set values in A1:A2 range', function (t) {
    sw.on('A1:A2').setValuesOneColumn('a1', 'a2')
    t.equal('a1', s.getActiveSheet().getRange('A1').getValue(), 'a1 value ok')
    t.equal('a2', s.getActiveSheet().getRange('A2').getValue(), 'a2 value ok')
  });
  
  s.getActiveSheet().clear()
  test('set values in A1:B1 range', function (t) {
    sw.on('A1:B1').setValuesOneRow('a1', 'b1')
    t.equal('a1', s.getActiveSheet().getRange('A1').getValue(), 'a1 value ok')
    t.equal('b1', s.getActiveSheet().getRange('b1').getValue(), 'b1 value ok')
  });
  
  s.getActiveSheet().clear()
  test('set single row values in A1:B2 range throws', function (t) {
    t.throws(() => sw.on('A1:B2').setValuesOneRow('a1', 'a2'))
  });
  test('set single col values in A1:B2 range throws', function (t) {
    t.throws(() => sw.on('A1:B2').setValuesOneColumn('a1', 'a2'))
  });
  
  s.getActiveSheet().clear()
  test('set values in A1:B2 range', function (t) {
    sw.on('A1:B2').setValues([['a1', 'b1'], ['a2', 'b2']])
    t.equal('a1', s.getActiveSheet().getRange('A1').getValue(), 'a1 value ok')
    t.equal('a2', s.getActiveSheet().getRange('A2').getValue(), 'a2 value ok')
    t.equal('b1', s.getActiveSheet().getRange('b1').getValue(), 'b1 value ok')
    t.equal('b2', s.getActiveSheet().getRange('b2').getValue(), 'b2 value ok')
  });

  s.getActiveSheet().clear()
  test('set values in A1:B range defined by data', function (t) {
    sw.on('A1:B').setValuesVariableLength([['a1', 'b1'], ['a2', 'b2']])
    t.equal('a1', s.getActiveSheet().getRange('A1').getValue(), 'a1 value ok')
    t.equal('a2', s.getActiveSheet().getRange('A2').getValue(), 'a2 value ok')
    t.equal('b1', s.getActiveSheet().getRange('b1').getValue(), 'b1 value ok')
    t.equal('b2', s.getActiveSheet().getRange('b2').getValue(), 'b2 value ok')
  });

  s.getActiveSheet().clear()
  test('set header values in A1:B1 range', function (t) {
    sw.on('A1:B1').setHeader('a1', 'b1')
    t.equal('a1', s.getActiveSheet().getRange('A1').getValue(), 'a1 value ok')
    t.equal('b1', s.getActiveSheet().getRange('B1').getValue(), 'b1 value ok')
  });

  DriveApp.getFileById(s.getId()).setTrashed(true)
  _test || test.finish()
}
