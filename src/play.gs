function play_deleteBookings() {
  bookingsInRange(new Date(2021, 11, 1), new Date(2021, 11, 31)).forEach(booking => deleteBooking(booking))

}

function play_getEvents() {

  CalendarApp.getEvents(new Date(2021, 11, 9), new Date(2021, 11, 10)).forEach(event => {
    let wl = worklog.fromEvent(event)
    if (wl.booking_info.billable) {
      console.log(event.getDescription())
      console.log(worklog)
    }
  })

}

function playSetDescription() {
  let selections = configure_selections([{ "date": "03.01.2022", "calendar_id": "040000008200E00074C5B7101A82E00800000000E034066304E5D701000000000000000010000000184826ED40E3854BAA28CB29F46D8574", "end_time": "09:45", "booking_info": { "hour_factor": 1, "billable": false }, "start_time": "09:30", "state": true, "summary": "WG: Daily Coaching und Workshops" }], 'ACCBILLMON-2')
  console.log(selections)
}
