class SheetSetup {
  constructor(name) {
    this.name = name
  }

  getSheet() {
    logger.log(`getting [${this.name}] sheet`)
    return SheetWrapper.createOrGetSheet(this.name)
  }

  setup() {
    throw new Error('not implemented');
  }

  remove() {
    SheetWrapper.getSheet(this.name).remove()
  }
  toString() {
    return `SheetSetup(${this.name})`
  }
}

var SetupService = class SetupService {
  constructor(){

  }
  get allSheets() {
    return [
      new MemberSheetSetup()
      , new SnapshotsSheetSetup()
      , new CurrentDataSheetSetup()
      , new ChartsSheetSetup()
      , new TimelineSheetSetup()
      , new TimelineAssignedSheetSetup()
      , new TimelineWipSheetSetup()
      , new CurrentChartSetup()
      , new AssignedChartSetup()
      , new WipChartSetup()
    ]
  }
  cleanUp() {
    logger.log('removing all trigger')
    ScriptApp.getScriptTriggers().forEach(t => ScriptApp.deleteTrigger(t))
    logger.info('removing all sheets')
    this.allSheets.forEach(s => s.remove())
    SpreadsheetApp.flush()
    logger.info('cleanup finished!')
  }

  setupTeamWiPTracker(clean = false) {
    logger.info('starting setup...')
    if (clean) {
      cleanUp()
    } else {
      logger.log('removing all trigger')
      ScriptApp.getScriptTriggers().forEach(t => ScriptApp.deleteTrigger(t))
    }
    this.allSheets.forEach(s => {
      logger.info(`setting up sheet [${s}]...`)
      s.setup()
    })
    SpreadsheetApp.flush()
    SpreadsheetApp.setActiveSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('setup'))
    logger.info('setup finished!')
  }

}

