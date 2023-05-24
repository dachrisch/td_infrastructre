function cleanup() {
  UserProperties.deleteProperty('active_calendar')
  CalendarApp.getEvents(range_from, range_to).forEach(event => event.deleteEvent())
  bookingsInRange(range_from, range_to).forEach(booking => {
    deleteBooking(booking)
  })
}

let range_from = new Date(1970, 5, 4)
let range_to = new Date(1970, 5, 5)

function integrationTestRunner(_test) {

  var test = _test || new GasTap()
  testDefaultBilling(test)
  testBillingFromDescription(test)
  testBillableBillingFromDescription(test)
  testBillableIsRecognizedAsAlreadyPresent(test)
  testConfigureBillable(test)
  _test || test.finish()
}

function testDefaultBilling(_test) {
  var test = _test || new GasTap()
  cleanup()

  test('book event to default billing ticket', function (t) {
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
    t.equal(0, bookings[0].billableSeconds, 'no billable seconds')
    t.equal(8 * 60 * 60, bookings[0].timeSpentSeconds, 'spent seconds = 8h')
    t.equal(event.getTitle(), bookings[0].comment, 'matching summary')
    t.equal("true", bookings[0].attributes._NotBillable_.value, 'not billable')
    t.equal("ACCBILLMON-2", bookings[0].issue.key, 'correct billing ticket')
    t.equal(moment(event.getStartTime()).format('YYYY-MM-DD HH:mm:ss.000'), bookings[0].started, 'correct start date')

  });
  _test || test.finish()
}

function testBillingFromDescription(_test) {
  var test = _test || new GasTap()
  cleanup()

  test('book event to billing ticket from description', function (t) {
    let event = CalendarApp.createEvent('Test Event Nine to Five', new Date(1970, 5, 4, 9), new Date(1970, 5, 4, 17))
    event.setDescription('booking://ACCBILLMON-3')
    let worklogs = getWorklogsAsJson(range_from.getTime(), range_to.getTime())

    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "17:00", summary: "Test Event Nine to Five", booking_info: { issue_key: "ACCBILLMON-3", billable: false, hour_factor: 1 } }, worklogs[0])

    book_selections(worklogs)
    let bookings = bookingsInRange(range_from, range_to)
    t.equal(1, bookings.length, 'only one booking created')
    t.equal("ACCBILLMON-3", bookings[0].issue.key, 'correct billing ticket')

  });
  _test || test.finish()
}

function testBillableBillingFromDescription(_test) {
  var test = _test || new GasTap()
  cleanup()

  test('book event to billing ticket from description', function (t) {
    let event = CalendarApp.createEvent('Test Event Nine to Five', new Date(1970, 5, 4, 9), new Date(1970, 5, 4, 17))
    event.setDescription('booking://ACCBILLMON-3?billable=true&hourFactor=1.125')
    let worklogs = getWorklogsAsJson(range_from.getTime(), range_to.getTime())
    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "17:00", summary: "Test Event Nine to Five", booking_info: { issue_key: "ACCBILLMON-3", billable: true, hour_factor: 1.125 } }, worklogs[0])
    book_selections(worklogs)
    let bookings = bookingsInRange(range_from, range_to)
    t.equal(1, bookings.length, 'only one booking created')
    t.equal("ACCBILLMON-3", bookings[0].issue.key, 'correct billing ticket')
    t.equal(8 * 60 * 60 * 1.125, bookings[0].timeSpentSeconds, 'spent seconds with factor')
    t.equal(bookings[0].timeSpentSeconds, bookings[0].billableSeconds, 'billable duration same as overall duration')
    t.equal('false', bookings[0].attributes._NotBillable_.value, 'is billable')

  });
  _test || test.finish()
}


function testBillableIsRecognizedAsAlreadyPresent(_test) {
  var test = _test || new GasTap()
  cleanup()

  test('book event and find it as existing', function (t) {
    let event = CalendarApp.createEvent('Test Event Nine to Five', new Date(1970, 5, 4, 9), new Date(1970, 5, 4, 10, 35))
    event.setDescription('booking://ACCBILLMON-3?billable=true&hourFactor=1.125')
    let worklogs = getWorklogsAsJson(range_from.getTime(), range_to.getTime())
    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "10:35", summary: "Test Event Nine to Five", booking_info: { issue_key: "ACCBILLMON-3", billable: true, hour_factor: 1.125 } }, worklogs[0])

    let bookings = book_selections(worklogs)
    t.equal(1, bookings.length, 'only one booking created')
    t.equal("ACCBILLMON-3", bookings[0].issue.key, 'correct billing ticket')

    let new_worklogs = getWorklogsAsJson(range_from.getTime(), range_to.getTime())
    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "10:35", summary: "Test Event Nine to Five", booking_info: { issue_key: "ACCBILLMON-3", billable: true, hour_factor: 1.125, booking_link: bookings[0].originId } }, new_worklogs[0])
  });
  _test || test.finish()
}

function testConfigureBillable(_test) {
  var test = _test || new GasTap()
  cleanup()
  test('update event with billable info', function (t) {
    let event = CalendarApp.createEvent('Test Event Nine to Five', new Date(1970, 5, 4, 9), new Date(1970, 5, 4, 10, 35))
    let worklogs = getWorklogsAsJson(range_from.getTime(), range_to.getTime())
    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "10:35", summary: "Test Event Nine to Five", booking_info: { issue_key: null, billable: false, hour_factor: 1 } }, worklogs[0], 'newly created')

    let configured_worklog = configure_selections(worklogs, 'ACCBILLTEST-1', true, 1.125)
    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "10:35", summary: "Test Event Nine to Five", booking_info: { issue_key: 'ACCBILLTEST-1', billable: true, hour_factor: 1.125 } }, configured_worklog[0], 'after configure_selections')
    let updated_event = CalendarApp.getEventById(event.getId())
    let updated_worklog = worklog.fromEvent(updated_event)
    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "10:35", summary: "Test Event Nine to Five", booking_info: { issue_key: 'ACCBILLTEST-1', billable: true, hour_factor: 1.125 } }, updated_worklog.toJson(), 'from calendar configured')

  });
  _test || test.finish()

}

