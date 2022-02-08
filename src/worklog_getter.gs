class worklog_getter {
  constructor(data_getter) {
    this.data_getter = data_getter
  }

  getWorklogsAsJson(from_date, to_date) {
    return this.data_getter.getData(from_date, to_date)
  }
}

class calendar_worklog_getter {
  getData(from_date, to_date) {
    let worklogs = getActiveCalendar().getEvents(from_date, to_date).map(event => worklog.fromEvent(event))
    console.info(`got ${worklogs.length} events in range [${from_date.toISOString()}, ${to_date.toISOString()}]`)
    return new worklogs_range(from_date, to_date, worklogs).toJson()
  }
}

function getWorklogsAsJson(from_unix_ts, to_unix_ts) {
  let from_date = new Date(from_unix_ts)
  let to_date = new Date(to_unix_ts)
  console.log(`get worklogs between ${from_date.toISOString()} and ${to_date.toISOString()}`)
  let worklogs = new worklog_getter(new calendar_worklog_getter()).getWorklogsAsJson(from_date, to_date)
  let bookings = bookingsInRange(from_date, to_date)

  let worklogs_with_link = worklogs.map(worklog => withBookingInfo(worklog, bookings))

  return worklogs_with_link
}
