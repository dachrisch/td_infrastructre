
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Team WiP')
    .addItem('Setup team WiP tracker...', 'createSetupMenu')
    .addToUi();
}

class SheetSetup {
  constructor(name) {
    this.name = name
  }

  getSheet() {
    console.log(`getting [${this.name}] sheet`)
    return SheetWrapper.createOrGetSheet(this.name)
  }

  setup() {
    throw new Error('not implemented');
  }

  remove() {
    SheetWrapper.getSheet(this.name).remove()
  }
}

function setupTeamWiPTracker() {
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

  sheets.forEach(s => s.remove())
  SpreadsheetApp.flush()
  sheets.forEach(s => s.setup())
  SpreadsheetApp.flush()
}

