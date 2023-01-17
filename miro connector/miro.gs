if ((typeof URI) === 'undefined') {
  eval(UrlFetchApp.fetch('https://rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());
}

Object.prototype.memberToString = function () {
  return Object.getOwnPropertyNames(this).map((propertyName) => `${propertyName}=${this[propertyName]}`).join(', ')
}

const NikoEntry = class NikoEntry {
  static fromRow(row) {
    return new NikoEntry(row[0], row[1], row[2])
  }

  constructor(name, value, description) {
    this.name = name
    this.value = value
    this.decription = description
  }

  hasValue() {
    return this.value != '' && this.value != 'No entry'
  }
}

const ItemPaginator = class ItemPaginator {
  constructor(miroConnector, type) {
    this.miroConnector = miroConnector
    this.type = type
    this.page = miroConnector.fetchWithParams('items', { type: this.type, limit: 10 })
  }

  items() {
    return this.page.data
  }

  next() {
    if (this.hasNext()) {
      this.page = this.miroConnector.fetchWithParams('items', { type: this.type, limit: 50, cursor: this.nextCursor() })
      return true
    } else {
      return false
    }
  }

  hasNext() {
    return this.page.cursor != undefined
  }

  nextCursor() {
    return this.page.cursor
  }

  toString() {
    return `${this.constructor.name}([${this.page.size}/${this.page.total}], cursor=${this.page.cursor})`
  }
}

const MiroBoard = class MiroBoard {
  static fromJson(jsonResponse, miroConnector) {
    return new MiroBoard(jsonResponse.id, jsonResponse.name, miroConnector)
  }

  constructor(boardId, name, miroConnector) {
    this.boardId = boardId
    this.name = name
    this.miroConnector = miroConnector
  }


  getFrame(frameId) {
    return MiroFrame.fromJson(this.miroConnector.fetch('frames/' + frameId), this.miroConnector)
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }
}
const StickyNoteFactory = class StickyNoteFactory {
  constructor(miroConnector) {
    this.miroConnector = miroConnector
  }

  fromJson(jsonResponse) {
    console.log(JSON.stringify(jsonResponse))
    return new StickyNote(jsonResponse.id, this.miroConnector)
  }
}
const StickyNote = class StickyNote {
  static withConnector(miroConnector) {
    return new StickyNoteFactory(miroConnector)
  }

  constructor(itemId,miroConnector) {
    this.itemId = itemId
    this.miroConnector = miroConnector
  }

  remove() {
    this.miroConnector.remove(`/items/${this.itemId}`)
  }
}

const MiroFrame = class MiroFrame {
  static fromJson(jsonResponse, miroConnector) {
    return new MiroFrame(jsonResponse.id, miroConnector)
  }
  constructor(frameId, miroConnector) {
    this.frameId = frameId
    this.miroConnector = miroConnector
  }

  getAllPostIts() {
    let stickyPaginator = new ItemPaginator(this.miroConnector, 'sticky_note')
    let postItsInFrame = []
    do {
      postItsInFrame.push(...stickyPaginator.items().filter(item => item.parent.id == this.frameId))
      console.log(stickyPaginator.toString())
    } while (stickyPaginator.next())
    let factory = new StickyNoteFactory(this.miroConnector)
    return postItsInFrame.map(item => factory.fromJson(item))
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}

const MiroBoardService = class MiroBoardService {
  static connectTo(boardId, token) {
    return new MiroBoardService(new api.ApiConnector('https://api.miro.com/v2/boards/' + boardId, token))
  }
  constructor(miroConnector) {
    this.miroConnector = miroConnector
  }

  getBoard() {
    return MiroBoard.fromJson(this.miroConnector.fetch(), this.miroConnector)
  }
}

function miro() {
  let boardService = MiroBoardService.connectTo('uXjVOHZTFtk=', 'eyJtaXJvLm9yaWdpbiI6ImV1MDEifQ_FuN2wYAGNBGVSrhiOQDPBbVdG1U')
  console.log(`connecting to ${boardService.getBoard()}`)
  boardService.getBoard().getFrame('3458764543523493517').getAllPostIts().forEach(item=>item.remove())

}

function sheet() {
  let weeklyView = sw.SpreadsheetWrapper.fromUrl('https://docs.google.com/spreadsheets/d/1QfDRt4MgPJcoqGrX_Jxp8YPbFNP7NmXO6KIGDBZ-2jI/').getSheet('weekly view')

  let nikoEntries = weeklyView.on('A3:C10').range.getValues().map(row => NikoEntry.fromRow(row))
  let entriesWithValues = nikoEntries.filter(entry => entry.hasValue())
  console.log(entriesWithValues)

}
