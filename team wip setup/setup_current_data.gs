class CurrentDataProperties {}
CurrentDataProperties.sheetName = 'chart_data_current'
CurrentDataProperties.keys = `${CurrentDataProperties.sheetName}_keys`
CurrentDataProperties.values = `${CurrentDataProperties.sheetName}_values`


class CurrentDataSheetSetup extends SheetSetup {
  constructor() {
    super(CurrentDataProperties.sheetName)
  }
  setup() {
    this.getSheet()
      .on('A1:E1').setHeader('Name', 'Jira ID', 'Total Assigned', 'Team Assigned', 'Team Working')
      .and().on('A2').setFormula('=ARRAYFORMULA(member_names)')
      .and().on('B2').setFormula(`=ARRAYFORMULA(${member_ids()})`)
      .and().on('A:A').setNamedRange(CurrentDataProperties.keys)
      .and().on('C2').setFormula(`=ARRAYFORMULA(totalAssignedFor(${member_ids()}; timestamp))`)
      .and().on('D2').setFormula(`=ARRAYFORMULA(assignedFor(${member_ids()}; timestamp))`)
      .and().on('E2').setFormula(`=ARRAYFORMULA(wipFor(${member_ids()}; timestamp))`)
      .and().on('D:E').setNamedRange(CurrentDataProperties.values)
      .and().on('G1').setHeader('Activation timestamp')
      .and().on('G2').setFormula('=text(max(snapshots!A:A);"yyyy-MM-DD HH:mm")').setNamedRange('timestamp')
  }
}
