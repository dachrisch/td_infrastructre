/** * @OnlyCurrentDoc */
function setup() {
  let ui = SpreadsheetApp.getUi()
  let response = ui.alert('Heads up!', 'Setup about to start. Continue?', ui.ButtonSet.OK_CANCEL)
  if (response == ui.Button.OK) {
    new teamwiptracker.SetupService().setupTeamWiPTracker()
  }
}

// make function visible for trigger
function makeTeamWiPSnapshot() {
  new teamwiptracker.SnapshotMaker().perform()
}

// make custom functions available in sheet
let customFunction = (f, ...params) => {
  return teamwiptracker.customFunctions().exec(f, ...params);
}
