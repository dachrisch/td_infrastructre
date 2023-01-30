if ((typeof URI) === 'undefined') {
  eval(UrlFetchApp.fetch('https://rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());
}

if ((typeof moment) === 'undefined') {
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js').getContentText());
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.40/moment-timezone-with-data.min.js').getContentText());
}

function importUnderscore() {
  if ((typeof _) === 'undefined') {
    eval(UrlFetchApp.fetch('https://cdn.jsdelivr.net/npm/underscore@1.13.6/underscore-umd-min.js').getContentText());
    _.memoize()
  }
}