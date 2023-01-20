const MiroFrame = class MiroFrame {
  static fromJson(jsonResponse, miroConnector) {
    return new MiroFrame(jsonResponse.id, miroConnector)
  }
  constructor(frameId, miroConnector) {
    this.frameId = frameId
    this.miroConnector = miroConnector
  }

  getAllPostIts() {
    log.fine(`getting all postits in [${this}]`)
    let stickyPaginator = new ItemPaginator(this.miroConnector, 'sticky_note')
    let postItsInFrame = []
    do {
      postItsInFrame.push(...stickyPaginator.items().filter(item => 'parent' in item && item.parent.id == this.frameId))
      log.fine(stickyPaginator.toString())
    } while (stickyPaginator.next())
    let factory = new StickyNoteFactory(this.miroConnector)
    return postItsInFrame.map(item => factory.fromJson(item))
  }

  addNikoEntry(nikoEntry, yFactor) {
    this.addSticky().name(nikoEntry.name).atX(50).atY(yFactor * 100 + 50).build().create()
    this.addSticky().name(nikoEntry.value).atX(150).atY(yFactor * 100 + 50).build().create()
    this.addSticky().name(nikoEntry.description).atX(300).atY(yFactor * 100 + 50).shape('rectangle').build().create()
  }

  addSticky() {
    let stickyFactory = new StickyNoteFactory(this.miroConnector)
    stickyFactory.parent(this.frameId)
    return stickyFactory
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}

const ItemPaginator = class ItemPaginator {
  constructor(miroConnector, type) {
    this.miroConnector = miroConnector
    this.type = type
    this.pageNum = 0
    this.pageSize = 50
    this.page = miroConnector.on('items').fetchWithParams({ type: this.type, limit: this.pageSize })
  }

  items() {
    return this.page.data
  }

  next() {
    if (this.hasNext()) {
      this.page = this.miroConnector.on('items').fetchWithParams({ type: this.type, limit: this.pageSize, cursor: this.nextCursor() })
      this.pageNum++
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
    return `${this.constructor.name}([${this.pageSize * this.pageNum}-${this.pageSize * this.pageNum + this.page.size}/${this.page.total}], cursor=${this.page.cursor})`
  }
}