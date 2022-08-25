
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

function setupTeamWiPTracker(clean = false) {
  sheets = [
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
  logger.info('starting setup...')
  logger.log('removing all trigger')
  ScriptApp.getScriptTriggers().forEach(t => ScriptApp.deleteTrigger(t))
  if (clean) {
    logger.info('removing all sheets')
    sheets.forEach(s => s.remove())
    SpreadsheetApp.flush()
  }
  sheets.forEach(s => {
    logger.info(`setting up sheet [${s}]...`)
    s.setup()
  })
  SpreadsheetApp.flush()
  logger.info('setup finished!')
}

