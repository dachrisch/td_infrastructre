function setupCharts() {
  new ChartsSheetSetup().setup()
}
class ChartsSheetSetup extends SheetSetup {
  constructor() {
    super('charts')
  }
  setup() {
    this.getSheet()
      .on('B21:C21').setHeader('from', 'to')
      .and().on('A22').setHeader('Data Range')
      .and().on('C22').setFormula('=DATEVALUE(now())').asDate().setNamedRange('date_to').requireDate()
      .and().on('B22').setFormula('=$C$22 - 5').asDate().setNamedRange('date_from').requireDate()
      .and().on('D22').setHeader('Timeframe')
      .and().on('E21:F21').setHeader('from', 'to')
      .and().on('E22').setValues(6).setNamedRange('time_from').requireHour()
      .and().on('F22').setValues(20).setNamedRange('time_to').requireHour()
      .and().on('A21:F23').withBackground('lightgrey')
      .and().on('B22:C22').withBackground('#6aa84f')
      .and().on('E22:F22').withBackground('#6aa84f')

  }
}
class CurrentChartSetup extends SheetSetup {
  constructor() {
    super('charts')
  }
  setup() {
    this.getSheet().newChart('Current Assigned & WiP')
      .setChartType(Charts.ChartType.COLUMN)
      .setPosition(1, 1, 0, 0)
      .addRange(CurrentDataProperties.keys)
      .addRange(CurrentDataProperties.values)
      .setNumHeaders(1)
      .build()
  }
}

class AssignedChartSetup extends SheetSetup {
  constructor() {
    super('charts')
  }
  setup() {
    this.getSheet().newChart('Assigned per Member')
      .setChartType(Charts.ChartType.STEPPED_AREA)
      .setPosition(24, 1, 0, 0)
      .addRange(TimelineProperties.keys)
      .addRange(TimelineProperties.values_assigned, true)
      .setNumHeaders(1)
      .build()
  }
}


class WipChartSetup extends SheetSetup {
  constructor() {
    super('charts')
  }
  setup() {
    this.getSheet().newChart('Wip per Member')
      .setChartType(Charts.ChartType.STEPPED_AREA)
      .setPosition(24, 8, 0, 0)
      .addRange(TimelineProperties.keys)
      .addRange(TimelineProperties.values_wip, true)
      .setNumHeaders(1)
      .build()
  }
}
