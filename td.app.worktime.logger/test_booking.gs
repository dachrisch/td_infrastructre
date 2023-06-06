if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
} // Class GasTap is ready for use now!


function bookingTestRunner(_test) {
  var test = _test || new GasTap()

  test('tempoBooking from element', function (t) {
    let booking = tempoBooking.fromElement({ date: "01.12.2021", summary: "Gemeinsamer Start", end_time: "10:00", start_time: "09:00" })
    t.deepEqual(new Date(2021, 11, 1, 9, 0), booking.start_date, 'date matches')
    t.equal(3600, booking.duration, 'duration matches')
    t.equal('Gemeinsamer Start', booking.summary, 'summary matches')
  });

  test('moment from date', function (t) {
    t.equal(3, moment("01.07.2022", "DD.MM.YYYY").quarter(), 'quarter from date string is 3')
  })

  _test || test.finish()
}