class MemberSheetSetup extends SheetSetup {
  static get name() { return 'member' }
  static get named_range_setup_ids() { return 'setup_member_ids' }
  static get named_range_ids() { return 'member_ids' }
  static get named_range_names() { return 'member_names' }
  constructor() {
    super(MemberSheetSetup.name)
  }
  setup() {
    this.getSheet().protect()
      .on('A1:B1').setHeader('Jira ID', 'Name')
      .and().on('A2').setFormula(`=ARRAYFORMULA(${MemberSheetSetup.named_range_setup_ids})`)
      .and().on(`A2:A${1 + this.memberCount}`).setNamedRange(MemberSheetSetup.named_range_ids)
      .and().on('B2').setFormula(`=ARRAYFORMULA(customFunction("firstName"; ${MemberSheetSetup.named_range_ids}))`)
      .and().on(`B2:B${1 + this.memberCount}`).setNamedRange(MemberSheetSetup.named_range_names)
  }

  get memberCount() {
    return this.sheetWrapper.multiCellValues(MemberSheetSetup.named_range_setup_ids).length
  }
}
