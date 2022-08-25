class SnapshotsSheetSetup extends SheetSetup {
  static get name() { return 'snapshots' }
  constructor() {
    super(SnapshotsSheetSetup.name)
  }
  setup() {
    this.getSheet().protect()
      .on('A1:E1').setHeader('Time', 'Jira ID', 'assigned', 'wip', 'Name')
      .and().on('E2').setFormula(`=ARRAYFORMULA(iferror(VLOOKUP(B2:B,{${MemberSheetSetup.named_range_ids},${MemberSheetSetup.named_range_names}},2,false)))`)
      .and().on('A:A').asDateTime()
    makeTeamWiPSnapshot()
    this.setupTrigger()
  }

  setupTrigger() {
    logger.log(`[${this.name}] - creating hourly trigger for snapshots`)
    ScriptApp.newTrigger(makeTeamWiPSnapshot.name).timeBased().everyHours(1).create()
  }
}
