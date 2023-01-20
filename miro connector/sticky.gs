const StickyNoteFactory = class StickyNoteFactory {
  constructor(miroConnector) {
    this.miroConnector = miroConnector
  }

  fromJson(jsonResponse) {
    return new StickyNote(jsonResponse.id, this.miroConnector)
  }

  name(name) {
    this._name = name
    return this
  }
  parent(parentId) {
    this._parentId = parentId
    return this
  }

  shape(shape) {
    this._shape = shape
    return this
  }

  atX(xPosition) {
    this._xPosition = xPosition
    return this
  }
  atY(yPosition) {
    this._yPosition = yPosition
    return this
  }

  size(size) {
    this._size = size
    return this
  }

  build() {
    return new StickyNote(0, this.miroConnector, this._name, this._parentId, this._xPosition, this._yPosition, this._size, this._shape)
  }
}
const StickyNote = class StickyNote {
  constructor(itemId, miroConnector, name, parentId, xPosition = 0, yPosition = 0, size = 100, shape = 'square') {
    this.itemId = itemId
    this.miroConnector = miroConnector
    this.name = name
    this.parentId = parentId
    this.xPosition = xPosition
    this.yPosition = yPosition
    this.shape = shape
    this.size = size
  }

  remove() {
    this.miroConnector.on(`/items/${this.itemId}`).remove()
  }

  create() {
    let stickyJson = {
      "data": {
        "content": this.name,
        "shape": this.shape
      },

      "parent": {
        "id": this.parentId
      },
      "geometry": {
        "height": this.size
      },
      "position": {
        "origin": "center",
        "x": this.xPosition,
        "y": this.yPosition
      },
      "style": {
        "fillColor": "light_yellow"
      }
    }
    log.info(`creating ${this}`)
    this.miroConnector.on('sticky_notes').post(stickyJson, 201)
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }

}

