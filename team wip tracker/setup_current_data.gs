class CurrentDataSheetSetup extends SheetSetup {
  static get name(){ return 'chart_data_current'}
  static get keys(){ return `${CurrentDataSheetSetup.name}_keys`}
  static get values(){ return `${CurrentDataSheetSetup.name}_values`}
  static get named_range_timestamp(){ return 'timestamp'}
  constructor() {
    super(CurrentDataSheetSetup.name)
  }
  setup() {
    this.getSheet().protect()
      .on('A1:E1').setHeader('Name', 'Jira ID', 'Total Assigned', 'Team Assigned', 'Team Working')
      .and().on('A2').setFormula(`=ARRAYFORMULA(${MemberSheetSetup.named_range_names})`)
      .and().on('B2').setFormula(`=ARRAYFORMULA(${MemberSheetSetup.named_range_ids})`)
      .and().on('A:A').setNamedRange(CurrentDataSheetSetup.keys)
      .and().on('C2').setFormula(`=ARRAYFORMULA(customFunction("totalAssignedFor";${MemberSheetSetup.named_range_ids}; timestamp))`)
      .and().on('D2').setFormula(`=ARRAYFORMULA(customFunction("assignedFor";${MemberSheetSetup.named_range_ids}; timestamp))`)
      .and().on('E2').setFormula(`=ARRAYFORMULA(customFunction("wipFor";${MemberSheetSetup.named_range_ids}; timestamp))`)
      .and().on('D:E').setNamedRange(CurrentDataSheetSetup.values)
      .and().on('G1').setHeader('Activation timestamp')
      .and().on('G2').setFormula('=text(max(snapshots!A:A);"yyyy-MM-DD HH:mm")').setNamedRange(CurrentDataSheetSetup.named_range_timestamp)
  }
}
