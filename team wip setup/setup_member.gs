
function memberCount() {
  return multiCellValues(member_ids()).length
}

class MemberSheetSetup extends SheetSetup {
  constructor() {
    super('member')
  }
  setup() {
    this.getSheet()
      .on('A1:B1').setHeader('Jira ID', 'Name')
      .and().on(`B2:B${1 + memberCount()}`).setNamedRange('member_names')
      .and().on('A2').setFormula(`=ARRAYFORMULA(${member_ids()})`)
      .and().on('B2').setFormula(`=ARRAYFORMULA(firstName(${member_ids()}))`)
  }
}
