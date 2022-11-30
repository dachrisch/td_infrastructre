const SheetLogger = class SheetLogger {
  constructor(range) {
    this.range = range
  }

  log(text) {
    this.range.setValue(text)
  }
}

const MultiLogger = class MultiLogger {
  constructor(infoLogger, debugLogger) {
    this.infoLogger = infoLogger
    this.debugLogger = debugLogger
  }

  info(text) {
    this.infoLogger.log(text)
  }

  debug(text) {
    this.debugLogger.log(text)
  }

  log(text) {
    this.debug(text)
  }
}

var logger = new MultiLogger(console, console)
