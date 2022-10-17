class SheetLogger {
  constructor(range) {
    this.range = range
  }

  log(text) {
    this.range.setValue(text)
  }
}

class MultiLogger {
  constructor(infoLogger, debugLogger) {
    this.infoLogger = infoLogger
    this.debugLogger = debugLogger
  }

  info(text) {
    this.infoLogger.log(text)
    this.debugLogger.log(text)
  }

  debug(text) {
    this.debugLogger.log(text)
  }

  log(text) {
    this.debug(text)
  }
}

var logger = new MultiLogger(console, console)
