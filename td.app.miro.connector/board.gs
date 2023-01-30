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

const MiroBoard = class MiroBoard {
  static fromJson(jsonResponse, miroConnector) {
    return new MiroBoard(jsonResponse.id, jsonResponse.name, miroConnector)
  }

  constructor(boardId, name, miroConnector) {
    this.boardId = boardId
    this.name = name
    this.miroConnector = miroConnector
    log.info(`connecting to ${this}`)
  }


  getFrame(frameId) {
    return MiroFrame.fromJson(this.miroConnector.on(`frames/${frameId}`).fetch(), this.miroConnector)
  }

  toString() {
    return `${this.constructor.name}(${this.memberToString()})`
  }
}