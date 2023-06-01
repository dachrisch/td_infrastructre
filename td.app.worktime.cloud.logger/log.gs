var log = logger.getLog({
  sheetId: null,
  level: globalTest ? logger.Level.FINEST : logger.Level.INFO,
  useNativeLogger: true
})

class Telemetry {
  static forSeries(seriesName) {
    //api.log.setLevel(logger.Level.FINEST)
    let cronitor = new api.ApiConnector('https://cronitor.link/p/e785985352b14396982fa07f4ec0afb3/hJICeq', { authHeaders: function () { return {} } })
    return new Telemetry(cronitor, `${seriesName}_${moment()}`)
  }
  constructor(cronitor, series) {
    this.series = series
    this.cronitor = cronitor
  }

  start() {
    this.cronitor.fetchWithParams({ state: 'run', series: this.series })
  }

  end() {
    this.cronitor.fetchWithParams({ state: 'complete', series: this.series })
  }

  count(amount, message) {
    this.cronitor.fetchWithParams({ series: this.series, 'metric': `count:${amount}`, message: message })
  }

}

