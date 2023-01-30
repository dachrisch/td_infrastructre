const RowToValueMapper = class RowToValueMapper {
  map(row) {
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}

const MultiUserDateTicketRowToValueMapper = class MultiUserDateTicketRowToValueMapper extends RowToValueMapper {
  constructor(token) {
    super()
    this.token = token
  }
  map(row) {
    if (row[0] == 'Datum' || row[0] == undefined || row[0] == '') {
      return BookingValue.EMPTY()
    }
    let workerKey = OtherIdentityService.connect(this.token, row[1]).workerKey()
    return new BookingValue(row[0], row[5], new URI(row[2]), workerKey, row[3], row[4], row[8])
  }
}

const SingleUserDateTicketRowToValueMapper = class SingleUserDateTicketRowToValueMapper extends RowToValueMapper{

  constructor(identityService) {
    super()
    this.identityService = identityService
  }
  map(row) {
    if (row[0] == undefined || row[0] == '') {
      return BookingValue.EMPTY()
    }
    let endMoment = moment('00:00', 'HH:mm').add(row[4] * 60, 'minutes')
    return new BookingValue(row[0], row[1], new URI(row[2]), this.identityService.workerKey(), '00:00', endMoment.format('HH:mm'), row[5])
  }
}