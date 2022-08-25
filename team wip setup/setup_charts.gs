function setupCharts() {
  new ChartsSheetSetup().setup()
}
class ChartsSheetSetup extends SheetSetup {
  constructor() {
    super('charts')
  }
  setup() {
    this.getSheet().move(2)
      .on('B20:C20').setHeader('from', 'to')
      .and().on('A21').setHeader('Data Range')
      .and().on('C21').setFormula('=DATEVALUE(now())').asDate().setNamedRange('date_to').requireDate()
      .and().on('B21').setFormula('=$C$21 - 5').asDate().setNamedRange('date_from').requireDate()
      .and().on('D21').setHeader('Timeframe')
      .and().on('E20:F20').setHeader('from', 'to')
      .and().on('E21').setValues(6).setNamedRange('time_from').requireHour()
      .and().on('F21').setValues(20).setNamedRange('time_to').requireHour()
      .and().on('A20:F22').withBackground('lightgrey')
      .and().on('B21:C21').withBackground('#6aa84f')
      .and().on('E21:F21').withBackground('#6aa84f')

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
      .addRange(CurrentDataSheetSetup.keys)
      .addRange(CurrentDataSheetSetup.values)
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
      .addRange(TimelineSheetSetup.keys)
      .addRange(TimelineSheetSetup.values_assigned, true)
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
      .addRange(TimelineSheetSetup.keys)
      .addRange(TimelineSheetSetup.values_wip, true)
      .setNumHeaders(1)
      .build()
  }
}
