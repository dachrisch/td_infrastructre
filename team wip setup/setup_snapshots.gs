class SnapshotsProperties {}
SnapshotsProperties.sheetName='snapshots'

class SnapshotsSheetSetup extends SheetSetup {
  constructor() {
    super(SnapshotsProperties.sheetName)
  }
  setup() {
    this.getSheet()
      .on('A1:E1').setHeader('Time', 'Jira ID', 'assigned', 'wip', 'Name')
      .and().on('E2').setFormula(`=ARRAYFORMULA(iferror(VLOOKUP(B2:B,{${member_ids()},member_names},2,false)))`)
      .and().on('A:A').asDateTime()
    makeTeamWiPSnapshot()
  }

 
}
