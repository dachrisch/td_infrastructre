function getWorklogsAsJson(from_unix_ts, to_unix_ts) {
  let from_date = new Date(from_unix_ts)
  let to_date = new Date(to_unix_ts)
  console.log(`get worklogs between ${from_date.toISOString()} and ${to_date.toISOString()}`)
  let worklogs = getActiveCalendar().getEvents(from_date, to_date).map(event => worklog.fromEvent(event))

  return worklogs
}
