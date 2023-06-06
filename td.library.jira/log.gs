var log = logger.getLog({
  sheetId: null,
  level: logger.Level.INFO,
  useNativeLogger: false
})

var enableDebugLog = function enableDebugLog() {
  log.setLevel(logger.Level.FINE)
  api.log.setLevel(logger.Level.FINE)
}