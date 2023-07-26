function playSearchService() {
  //console.log(issuesWithStatusChangeInTimeframe('01.01.2023', '01.05.2023', ['FRA', ''], 'Ready to deploy live', 'Story', 'key,fields.issuetype.name,fields.timeestimate'))
  console.log(issuesFromQueryWithFields(`project in (HYDAC, Frankana) AND (labels not in (AEM, admin, fe-sprint, fe-done, MUC, team-muc, team-stable, bloodstream, Bloodsteam, team-zero, tdec) OR labels is EMPTY) AND status changed from ("quality review", "in progress") to ("to Deploy", ReleaseBuilding, "Testing PO", "Ready for Live-release") during ("2022/05/05", "2022/05/11")  AND timespent != 0`,[['issuetype.name','timeestimate']]))
}

function play() {
  console.log('key, fields.issuetype.name, fields.timespent'.split(',').map(k=>k.split('.').map(k=>k.trim())).filter(k=>k[0]==='fields').map(k=>k[1]))
}
