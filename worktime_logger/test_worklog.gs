if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
} // Class GasTap is ready for use now!


class test_worklog_getter {
  getData(from_date, to_date) {
    let worklogs = [
      new worklog(new Date(2021, 11, 1, 12, 0), new Date(2021, 11, 1, 13, 0), 'test log'),
      new worklog(new Date(2021, 11, 2, 12, 0), new Date(2021, 11, 2, 13, 0), 'test log')
    ]
    return new worklogs_range(from_date, to_date, worklogs).toJson()
  }
}

class test_event {
  constructor(start_date, end_date, title, description) {
    this.start_date = start_date
    this.end_date = end_date
    this.title = title
    this.description = description
  }
  getStartTime() {
    return this.start_date
  }
  getEndTime() {
    return this.end_date
  }
  getTitle() {
    return this.title
  }
  getDescription() {
    return this.description
  }

  getId() {
    return 1
  }
}

function worklogTestRunner(_test) {
  var test = _test || new GasTap()

  let event = new test_event(new Date('2021-12-01 12:00'), new Date('2021-12-01 13:00'), 'test summary', 'booking://ABC-123')
  test('google event to worklog', function (t) {
    t.deepEqual(new worklog(
      new Date('2021-12-01 12:00'),
      new Date('2021-12-01 13:00'),
      'test summary', new bookingInfo('ABC-123'), 1), worklog.fromEvent(event), 'worklog.fromEvent(event)')
  })

  test('worklog to json', function (t) {
    t.equal('{"date":"01.12.2021","start_time":"12:00","end_time":"13:00","summary":"test log","calendar_id":null}',
      JSON.stringify(new worklog(new Date(2021, 11, 1, 12, 0), new Date(2021, 12, 1, 13, 0), 'test log').toJson()), 'start, end, summary to json')
    t.equal('{"date":"01.12.2021","start_time":"12:00","end_time":"13:00","summary":"test summary","booking_info":{"issue_key":"ABC-123","billable":false,"hour_factor":1,"booking_link":null},"calendar_id":1}',
      JSON.stringify(worklog.fromEvent(event).toJson()), 'booking issue to json')
  })

  test('get json for worklogs in range', function (t) {
    let now = new Date(2021, 11, 1);
    let later = new Date(2021, 11, 7);
    let worklogs_in_range = new worklogs_range(now, later, [new worklog(new Date(2021, 11, 1, 12, 0), new Date(2021, 11, 1, 13, 0), 'test log')])
    t.equal('[{"date":"01.12.2021","start_time":"12:00","end_time":"13:00","summary":"test log","calendar_id":null}]',
      JSON.stringify(worklogs_in_range.toJson()), 'worklogs_in_range.toJson()')
  })

  test('get json from worklog getter', function (t) {
    let json = new worklog_getter(new test_worklog_getter()).getWorklogsAsJson()
    t.equal('[{"date":"01.12.2021","start_time":"12:00","end_time":"13:00","summary":"test log","calendar_id":null},{"date":"02.12.2021","start_time":"12:00","end_time":"13:00","summary":"test log","calendar_id":null}]',
      JSON.stringify(json), 'new worklog_getter(new test_worklog_getter()).getWorklogsAsJson()')
  })

  test('worklog with billable info', function (t) {
    let billable_event = new test_event(null, null, null, 'booking://ACCBILLMON-2?billable=true&hourFactor=1.125')
    let booking_info = worklog.fromEvent(billable_event).booking_info
    t.equal('ACCBILLMON-2', booking_info.issue_key, 'issue is mapped')
    t.equal(true, booking_info.billable, 'is billable')
    t.equal(1.125, booking_info.hour_factor, 'factor is 1.125')
  })

  test('worklog with billable info as html', function (t) {
    let billable_event = new test_event(null, null, null, 'booking://ACCBILLMON-2?billable=true&amp;hourFactor=1.125')
    let booking_info = worklog.fromEvent(billable_event).booking_info
    t.equal('ACCBILLMON-2', booking_info.issue_key, 'issue is mapped')
    t.equal(true, booking_info.billable, 'is billable')
    t.equal(1.125, booking_info.hour_factor, 'factor is 1.125')
  })

  test('worklog with billable info variously mindled', function (t) {
    check_object_matches(t, { issue_key: 'ACCBILLMON-2', billable: true, hour_factor: 1.125 }, worklog.fromEvent(new test_event(null, null, null, '\nbooking://ACCBILLMON-2?billable=true&amp;hourFactor=1.125')).booking_info)
    check_object_matches(t, { issue_key: 'ACCBILLMON-2', billable: true, hour_factor: 1.125 }, worklog.fromEvent(new test_event(null, null, null, 'booking://ACCBILLMON-2?billable=true&amp;hourFactor=1.125\nthis should be ignored')).booking_info)
    check_object_matches(t, { issue_key: 'ACCBILLMON-2', billable: true, hour_factor: 1.125 }, worklog.fromEvent(new test_event(null, null, null, 'something before\nbooking://ACCBILLMON-2?billable=true&amp;hourFactor=1.125')).booking_info)
    check_object_matches(t, { issue_key: 'ACCBILLMON-2', billable: true, hour_factor: 1.125 }, worklog.fromEvent(new test_event(null, null, null, 'something before\nbooking://ACCBILLMON-2?billable=true&amp;hourFactor=1.125\nsomething after')).booking_info)
    check_object_matches(t, { issue_key: 'ACCBILLMON-3', billable: false, hour_factor: 1 }, worklog.fromEvent(new test_event(null, null, null, 'booking://ACCBILLMON-3')).booking_info)
    check_object_matches(t, { issue_key: 'ACCBILLMON-3', billable: false, hour_factor: 1 }, worklog.fromEvent(new test_event(null, null, null, '<html-blob>booking://ACCBILLMON-3<u></u></html-blob>')).booking_info)
    check_object_matches(t, { issue_key: 'ACCBILLMON-3', billable: false, hour_factor: 1 }, worklog.fromEvent(new test_event(null, null, null, '<html-blob><u></u>Lukas&nbsp;</html-blob><br><html-blob>booking://ACCBILLMON-3<u></u><u></u><u></u></html-blob>')).booking_info)
  })

  test('worklog without billable info', function (t) {
    let billable_event = new test_event()
    let booking_info = worklog.fromEvent(billable_event).booking_info
    t.equal(false, booking_info.billable, 'is not billable')
  })

  test('worklog renders new description from billing info', (t) => {
    let _worklog = new worklog(new Date('2021-12-01 12:00'), new Date('2021-12-01 13:00'), 'test summary', new bookingInfo('ABC-123'), 1)
    t.equal('booking://ABC-123?billable=false&hourFactor=1', _worklog.booking_info.toDescriptionString(), 'booking with ticket')
    _worklog.booking_info.hour_factor = 1.125
    t.equal('booking://ABC-123?billable=false&hourFactor=1.125', _worklog.booking_info.toDescriptionString(), 'booking with hourly rate')
    _worklog.booking_info.billable = true
    t.equal('booking://ABC-123?billable=true&hourFactor=1.125', _worklog.booking_info.toDescriptionString(), 'booking with billable')
  })

  _test || test.finish()
}