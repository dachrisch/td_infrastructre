
if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
} // Class GasTap is ready for use now!


function matcherTestRunner(_test) {
  var test = _test || new GasTap()

  test('add booking link to worklog', function (t) {
    let worklog = { "date": "04.06.1970", "start_time": "09:00", "end_time": "17:00", "summary": "Test Event Nine to Five", booking_info: { booking_link: null, hour_factor: 1 } }

    let bookings = [{ "billableSeconds": 0, "timeSpentSeconds": 28800, "tempoWorklogId": 1013462, "issue": { "key": "ACCBILLMON-3", "id": 78072 }, "comment": "Test Event Nine to Five", "attributes": { "_NotBillable_": { "workAttributeId": 2, "value": "true" } }, "worker": "JIRAUSER19505", "updater": "JIRAUSER19505", "dateUpdated": "2021-12-28 17:05:28.000", "originTaskId": 78072, "dateCreated": "2021-12-28 17:05:28.000", "started": "1970-06-04 09:00:00.000", "originId": 1013462 }]

    let booked_worklog = withBookingInfo(worklog, bookings)
    t.equal('1013462', booked_worklog.booking_info.booking_link, 'matching has link to booking')
    t.equal('ACCBILLMON-3', booked_worklog.booking_info.issue_key, 'issue key')

    worklog = { "date": "04.06.1970", "start_time": "10:00", "end_time": "17:00", "summary": "Test Event Nine to Five", booking_info: { issue_key: 'ABC-123', billable: false, hour_factor: 1, booking_link: null } }
    let new_worklog = withBookingInfo(worklog, bookings)
    t.equal(true, new_worklog.booking_info != null, 'new has default info')
    t.equal(null, new_worklog.booking_info.booking_link, 'new has no link')
  });

  _test || test.finish()
}

function sample() {
  let worklog = getWorklogsAsJson(new Date(2021, 11, 6, 10), new Date(2021, 11, 6, 11, 30))[1]
  console.log(JSON.stringify(worklog))
}