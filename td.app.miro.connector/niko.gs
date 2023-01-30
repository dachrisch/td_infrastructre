const NikoSheetService = class NikoSheetService {
  constructor(spreadsheetId, sheetName) {

    this.weeklyView = sw.SpreadsheetWrapper.fromUrl(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/`).getSheet(sheetName)

  }

  nikoEntries() {
    let nikoEntries = this.weeklyView.on('A3:C10').range.getValues().map(row => NikoEntry.fromRow(row))
    return nikoEntries.filter(entry => entry.hasValue())

  }
}

const NikoEntry = class NikoEntry {
  static fromRow(row) {
    return new NikoEntry(row[0], row[1], row[2])
  }

  constructor(name, value, description) {
    this.name = name
    this.value = value
    this.description = description
  }

  hasValue() {
    return this.value != '' && this.value != 'No entry'
  }
}