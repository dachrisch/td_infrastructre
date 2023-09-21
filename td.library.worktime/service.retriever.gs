const aggregatePerDay = (m, e) => {
  let date = e.startMoment.format('DD.MM.YYYY')
  let duration = e.duration().as('hours')
  m.set(date, (m.get(date) || 0) + duration)
  return m
}


class CalendarRetrieverService {
  /**
   * @param {CalandarService} calendarService
   * @see @link https://script.google.com/home/projects/1-N9OkafA2sQBYZjSbwtv5QYM7x4bB4DZJ-h2nryF1XPcX2GzNkNKQLnQ/settings
   */
  constructor(calendarService) {
    this.calendarService = calendarService
  }

  /**
   * @return {Array<Array.<string, number>>} - get the sum of worked time per day
   */
  retrieveWorkdays(momentFrom, momentTo) {

    return [...this.calendarService.byName('worktimes').getEvents(momentFrom, momentTo).reduce(aggregatePerDay, new Map())]
  }

  retrieveBookable(momentFrom, momentTo) {
    return [...this.calendarService.all().reduce((allEvents, calendar) => allEvents.concat(calendar.getEvents(momentFrom, momentTo)), [])
      .filter(e => e.bookingInfo.issueKey !== null)
      .reduce(aggregatePerDay, new Map())]
  }

  /**
   * @return {Array.<Array.<string>>} - days with vacation
   */
  retrieveVacations(momentFrom, momentTo) {
    return this.calendarService.getDefault().getEvents(momentFrom, momentTo)
      .filter((w) => w.title == 'Urlaub')
      .reduce((vacationDays, current) => {
        let day = current.startMoment
        while (day.isBefore(current.endMoment)) {
          vacationDays.push(day.clone())
          day.add(1, 'd')
        }
        return vacationDays
      }, new Array())
      .map((d) => [d.format('DD.MM.YYYY')])
  }


  retrieveHolidays(momentFrom, momentTo) {
    return this.calendarService.byName('Feiertage in Deutschland').getEvents(momentFrom, momentTo)
      .map((e) => [e.startMoment.format('DD.MM.YYYY'), e.title])
  }


}
