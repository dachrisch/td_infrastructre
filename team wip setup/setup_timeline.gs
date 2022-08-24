class TimelineProperties {}
TimelineProperties.keys='timeline_time'
TimelineProperties.values_assigned='timeline_assigned_values'
TimelineProperties.values_wip='timeline_wip_values'

class TimelineSheetSetup extends SheetSetup {
  constructor() {
    super('timeline')
  }
  setup() {
    let numMember = multiCellValues(member_ids()).length
    if (numMember > 12) {
      throw 'can not handle more than 12 member'
    }
    let charCodeAssignedEnd = 'A'.charCodeAt(0) + numMember

    this.getSheet()
      .on('A1').setFormula(`=QUERY({arrayformula(snapshots!A1:E1);filter(snapshots!A:E; WEEKDAY(snapshots!A:A;2)<6)};"select Col1, sum(Col3), sum(Col4) where hour(Col1)>="&(time_from)&" and hour(Col1)<="&(time_to)&" and Col1<=date '"&text(date_to+1;"yyyy-mm-dd")&"' and Col1>=date '"&text(date_from;"yyyy-mm-dd")&"' group by Col1 pivot Col5 label sum(Col3) '/ass', sum(Col4) '/wip' format Col1 'DD.MM.YY HH:mm'")`)
      .and().on('A1:A').setNamedRange(TimelineProperties.keys)

      .and().on(`B1:${String.fromCharCode(charCodeAssignedEnd)}`).setNamedRange(TimelineProperties.values_assigned)
      .and().on(`${String.fromCharCode(charCodeAssignedEnd + 1)}1:${String.fromCharCode(charCodeAssignedEnd + numMember)}`).setNamedRange(TimelineProperties.values_wip)

  }
}


class TimelineAssignedSheetSetup extends SheetSetup {
  constructor() {
    super('chart_data_assigned')
  }
  setup() {
    this.getSheet()
      .on('A1').setFormula(`=ARRAYFORMULA(${TimelineProperties.keys})`)
      .and().on('B1').setFormula(`=ARRAYFORMULA(${TimelineProperties.values_assigned})`)
  }
}


class TimelineWipSheetSetup extends SheetSetup {
  constructor() {
    super('chart_data_wip')
  }
  setup() {
    SheetWrapper.createOrGetSheet('chart_data_wip')
      .on('A1').setFormula(`=ARRAYFORMULA(${TimelineProperties.keys})`)
      .and().on('B1').setFormula(`=ARRAYFORMULA(${TimelineProperties.values_wip})`)
  }
}