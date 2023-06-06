function cleanup() {
  PropertiesService.getUserProperties().deleteProperty('active_calendar')
  setUserProperty('tempoToken', scriptProperty('tempoToken'))
  setUserProperty('jiraToken', scriptProperty('jiraToken'))
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
  testCalendarEvents(test)
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
    t.equal('1970-06-04', booked_selections[0].date, 'matching date')
    t.equal('09:00:00', booked_selections[0].start_time, 'matching start_time')
    t.equal('17:00:00', booked_selections[0].end_time, 'matching end_time')
    t.equal(28800, booked_selections[0].timeSpentSeconds, 'matching summary')
    t.equal(event.getTitle(), booked_selections[0].comment, 'matching summary')
    t.equal(false, booked_selections[0].billable, 'matching billable')
    t.equal('ACCBILLMON-2', booked_selections[0].issueKey, 'matching billing key')
    t.equal(true, booked_selections[0].worklogId!= undefined, 'has billing id')
    t.equal('_NotBillable_', booked_selections[0].attributes[0].key, 'has non billable attribute')
    t.equal(true, booked_selections[0].attributes[0].value, 'has non billable attribute = true')

    let bookings = bookingsInRange(range_from, range_to)
    t.equal(1, bookings.length, 'only one booking created')
    t.equal(0, bookings[0].billableSeconds, 'no billable seconds')
    t.equal(8 * 60 * 60, bookings[0].timeSpentSeconds, 'spent seconds = 8h')
    t.equal(event.getTitle(), bookings[0].comment, 'matching summary')
    t.equal(false, bookings[0].billable, 'not billable')
    t.equal("ACCBILLMON-2", bookings[0].issueKey, 'correct billing ticket')
    t.equal(moment(event.getStartTime()).format('HH:mm:ss'), bookings[0].start_time, 'correct start time')

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
    t.equal("ACCBILLMON-3", bookings[0].issueKey, 'correct billing ticket')

  });
  _test || test.finish()
}

function testBillableBillingFromDescription(_test) {
  var test = _test || new GasTap()
  cleanup()

  test('book billable event to billing ticket from description', function (t) {
    let event = CalendarApp.createEvent('Test Event Nine to Five', new Date(1970, 5, 4, 9), new Date(1970, 5, 4, 17))
    event.setDescription('booking://ACCBILLMON-3?billable=true&hourFactor=1.125')
    let worklogs = getWorklogsAsJson(range_from.getTime(), range_to.getTime())
    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "17:00", summary: "Test Event Nine to Five", booking_info: { issue_key: "ACCBILLMON-3", billable: true, hour_factor: 1.125 } }, worklogs[0])
    let booked_selections = book_selections(worklogs)
    t.equal(0, booked_selections[0].attributes.length, 'has non billable attribute not set')
    let bookings = bookingsInRange(range_from, range_to)
    t.equal(1, bookings.length, 'only one booking created')
    t.equal("ACCBILLMON-3", bookings[0].issueKey, 'correct billing ticket')
    t.equal(bookings[0].timeSpentSeconds * 1.125, bookings[0].billableSeconds, 'spent seconds with factor')
    t.equal(true, bookings[0].billable, 'is billable')

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
    t.equal("ACCBILLMON-3", bookings[0].issueKey, 'correct billing ticket')
    t.equal(true, bookings[0].worklogId != undefined, 'has id')

    let new_worklogs = getWorklogsAsJson(range_from.getTime(), range_to.getTime())
    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "10:35", summary: "Test Event Nine to Five", booking_info: { issue_key: "ACCBILLMON-3", billable: true, hour_factor: 1.125, booking_link: bookings[0].worklogId } }, new_worklogs[0])
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
    let updated_event = calendarWrapper().getDefault().getEventById(event.getId())
    let updated_worklog = worklog.fromEvent(updated_event)
    check_object_matches(t, { date: "04.06.1970", start_time: "09:00", end_time: "10:35", summary: "Test Event Nine to Five", booking_info: { issue_key: 'ACCBILLTEST-1', billable: true, hour_factor: 1.125 } }, updated_worklog, 'from calendar configured')

  });
  _test || test.finish()

}

