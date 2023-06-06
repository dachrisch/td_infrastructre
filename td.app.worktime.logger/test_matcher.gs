
if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
} // Class GasTap is ready for use now!


function matcherTestRunner(_test) {
  var test = _test || new GasTap()
  cleanup()

  test('booked event has booking info', function (t) {
    console.log(moment.tz('1970-06-04 09:00','Europe/Berlin').toDate())
    let event = CalendarApp.createEvent('Test Event Nine to Five', moment.tz('1970-06-04 09:00','Europe/Berlin').toDate(), moment.tz('1970-06-04 17:00','Europe/Berlin').toDate())
    event.setDescription('booking://ACCBILLMON-2')
    let worklogs = getWorklogsAsJson(range_from.getTime(), range_to.getTime())

    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "17:00", summary: "Test Event Nine to Five" }, worklogs[0])

    let booked_selections = book_selections(worklogs)
    t.equal(1, booked_selections.length, 'one item booked')
    t.equal(event.getTitle(), booked_selections[0].comment, 'matching summary')

    let bookings = bookingsInRange(range_from, range_to)
    t.equal(1, bookings.length, 'only one booking created')
    let booked_worklog = bookings[0]

    t.equal('ACCBILLMON-3', booked_worklog.booking_info.issue_key, 'issue key')
    t.equal('1013462', booked_worklog.booking_info.booking_link, 'matching has link to booking')

  });
  _test || test.finish()
}


function sample() {
  let worklog = getWorklogsAsJson(new Date(2021, 11, 6, 10), new Date(2021, 11, 6, 11, 30))[1]
  console.log(JSON.stringify(worklog))
}