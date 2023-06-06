class CalendarInstanceWrapper extends entity.Entity {
  /**
   * @param {CalendarApp.Calendar} calendar
   */
  static fromApp(calendar) {
    return new CalendarInstanceWrapper(calendar.getName(), calendar.getId(), calendar)
  }

  /**
   * @param {CalendarApp.Calendar} calendar
   * 
   */
  constructor(name, _id, calendar) {
    super()
    this.name = name
    this.id = _id
    this.calendar = calendar
  }

  /**
   * @param {moment} fromMoment
   * @param {moment} toMoment
   * @returns {EventWrapper}
   * @see @link https://script.google.com/home/projects/1R83PIhOu4_HmnP2OHGSuHYdntwm7wYWjCn88URTDGauD5LVwTVSgkdAM
   */
  getEvents(fromMoment, toMoment) {
    return this.calendar.getEvents(new Date(fromMoment), new Date(toMoment)).map(entity.EventWrapper.fromEvent)
  }

  /**
   * @param {string} eventId
   */
  getEventById(eventId) {
    let calendarEvent = this.calendar.getEventById(eventId)
    if (!calendarEvent) {
      throw new CalendarError(this, `couldn't find event by id: ${eventId}`)
    }
    return entity.EventWrapper.fromEvent(calendarEvent)
  }

  /**
   * @param {entity.EventWrapper} event
   * @param {moment} event.startMoment
   * @param {moment} event.endMoment
   * @param {String} event.title
   * @param {entity.BookingInfo} event.bookingInfo
   * @param {String} event.eventId

   */
  saveEvent(event) {
    let calendarEvent = this.calendar.getEventById(event.eventId)
    if (!calendarEvent) {
      // maybe not in this calendar
      // XXX - https://issuetracker.google.com/issues/151142698?pli=1
      calendarEvent = this.getEvents(event.startMoment, event.endMoment).filter(e => e.eventId == event.eventId)[0]
    }
    if (!calendarEvent) {
      throw new CalendarError(this, `couldn't find event by id: ${eventId}`)
    }
    let oldDescription = calendarEvent.getDescription().replaceAll(/^booking:\/\/.*$/gm, '')
    let newDescription = event.bookingInfo.toDescription()
    if (oldDescription) {
      newDescription += '\n' + oldDescription
    }
    calendarEvent.setDescription(newDescription.trim())
    return event
  }
}

