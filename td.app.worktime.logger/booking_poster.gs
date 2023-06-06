function book_selections(selections) {
  return selections.map(selection => {
    let booking = entity.EventWrapper.fromSelection(selection)
    try {
      return TempoBookingWrapperService.getInstance().fromTempo(tempoBookService().book(booking))
    } catch (e) {
      Logger.log(`error while posting [${JSON.stringify(booking)}]: ${e}`)
      throw Error(`error while posting [${JSON.stringify(booking)}]: ${e}`)
    }
  })
}
