function doGet() {
  var template = HtmlService.createTemplateFromFile("index")
  return template.evaluate()
}

function getScriptUrl() {
  var url = ScriptApp.getService().getUrl();
  return url;
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename)
    .evaluate().getContent();
}
