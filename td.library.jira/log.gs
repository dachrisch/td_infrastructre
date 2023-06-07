var log = logger.getLog({
  sheetId: null,
  level: logger.Level.INFO,
  useNativeLogger: true
})

var enableDebugLog = function enableDebugLog() {
  log.setLevel(logger.Level.FINE)
  api.log.setLevel(logger.Level.FINE)
}