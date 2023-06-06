
if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
} // Class GasTap is ready for use now!


function testCalendarEvents(_test) {
  var test = _test || new GasTap()
  cleanup()

  test('get events from calendar', function (t) {
    let calendars = loadCalendars()

    t.equal(calendarWrapper().getDefault().id, loadCalendars().filter((c) => c.active)[0].id, 'default calendar is active calendar')
  });


  _test || test.finish()
}

