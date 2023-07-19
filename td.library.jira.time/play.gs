function playSearchService() {
  console.log(issuesWithTimespentInTimeframe('01.01.2023', '01.05.2023', ['FRA', ''], 'Ready to deploy live', 'Story', 'key,fields.issuetype,fields.timeestimate'))
}

function play() {
  console.log('key, fields.issuetype.name, fields.timespent'.split(',').map(k=>k.split('.').map(k=>k.trim())).filter(k=>k[0]==='fields').map(k=>k[1]))
}