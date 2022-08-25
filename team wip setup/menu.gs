function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Team WiP')
    .addItem('Setup team WiP tracker...', setupTeamWiPTracker.name)
    .addToUi();
}
