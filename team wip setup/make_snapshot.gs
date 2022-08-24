 /**
   * function which is called by trigger to genrate snapshot
   */
  function makeTeamWiPSnapshot() {
    SheetWrapper(SnapshotsProperties.sheetName).on('A:D').appendValues(mapSnapshotToValues(snapshotWip(multiCellValues(member_ids()))))
  }
/**
 * @param {Array.<Object>} snapshots
 * @return {Array.<Array>} Array with time, name, assigned and wip
 */
function mapSnapshotToValues(snapshots) {
  let snapshotTime = new Date()
  return Object.keys(snapshots).map((name) => [snapshotTime, name, snapshots[name].assigned, snapshots[name].wip])
}

/**
 * @param {Array.<String>} jiraIds
 * @return {Object} - Object containing {'name' : {'assigned' : <num>, 'wip' : <num>}}
 */
function snapshotWip(jiraIds) {
  return jiraIds.reduce((obj, jiraId) => Object.assign(obj, { [jiraId]: { assigned: assignedFor(jiraId), wip: wipFor(jiraId) } }), {});
}
