class TimelineSheetSetup extends SheetSetup {
  static get name() { return 'timeline' }
  static get keys() { return 'timeline_time' }
  static get values_assigned() { return 'timeline_assigned_values' }
  static get values_wip() { return 'timeline_wip_values' }
  constructor() {
    super(TimelineSheetSetup.name)
  }
  setup() {
    let numMember = multiCellValues(MemberSheetSetup.named_range_ids).length
    if (numMember > 12) {
      throw 'can not handle more than 12 member'
    }
    let charCodeAssignedEnd = 'A'.charCodeAt(0) + numMember

    this.getSheet().protect()
      .on('A1').setFormula(`=QUERY({arrayformula(snapshots!A1:E1);filter(snapshots!A:E; WEEKDAY(snapshots!A:A;2)<6)};"select Col1, sum(Col3), sum(Col4) where hour(Col1)>="&(time_from)&" and hour(Col1)<="&(time_to)&" and Col1<=date '"&text(date_to+1;"yyyy-mm-dd")&"' and Col1>=date '"&text(date_from;"yyyy-mm-dd")&"' group by Col1 pivot Col5 label sum(Col3) '/ass', sum(Col4) '/wip' format Col1 'DD.MM.YY HH:mm'")`)
      .and().on('A1:A').setNamedRange(TimelineSheetSetup.keys)

      .and().on(`B1:${String.fromCharCode(charCodeAssignedEnd)}`).setNamedRange(TimelineSheetSetup.values_assigned)
      .and().on(`${String.fromCharCode(charCodeAssignedEnd + 1)}1:${String.fromCharCode(charCodeAssignedEnd + numMember)}`).setNamedRange(TimelineSheetSetup.values_wip)

  }
}


class TimelineAssignedSheetSetup extends SheetSetup {
  static get name() { return 'chart_data_assigned' }
  constructor() {
    super(TimelineAssignedSheetSetup.name)
  }
  setup() {
    this.getSheet().protect()
      .on('A1').setFormula(`=ARRAYFORMULA(${TimelineSheetSetup.keys})`)
      .and().on('B1').setFormula(`=ARRAYFORMULA(${TimelineSheetSetup.values_assigned})`)
  }
}


class TimelineWipSheetSetup extends SheetSetup {
  static get name() { return 'chart_data_wip' }
  constructor() {
    super(TimelineWipSheetSetup.name)
  }
  setup() {
    this.getSheet().protect()
      .on('A1').setFormula(`=ARRAYFORMULA(${TimelineSheetSetup.keys})`)
      .and().on('B1').setFormula(`=ARRAYFORMULA(${TimelineSheetSetup.values_wip})`)
  }
}