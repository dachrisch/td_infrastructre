Object.prototype.memberToString = function () {
  return Object.getOwnPropertyNames(this).map((propertyName) => `${propertyName}=${this[propertyName]}`).join(', ')
}

function nikoNikoToCoworkingBoard() {
  let boardService = MiroBoardService.connectTo('uXjVOSphBU0=', 'eyJtaXJvLm9yaWdpbiI6ImV1MDEifQ_FuN2wYAGNBGVSrhiOQDPBbVdG1U')
  let nikoFrame = boardService.getBoard().getFrame('3458764543483030808')
  log.info(`removing all stickies from ${nikoFrame}`)
  nikoFrame.getAllPostIts().forEach(item => item.remove())

  nikoFrame.addSticky().name(`Niko-Niko Week ${moment().format('W')}`).atX(150).atY(50).shape('rectangle').build().create()

  let entriesWithValues = new NikoSheetService('1QfDRt4MgPJcoqGrX_Jxp8YPbFNP7NmXO6KIGDBZ-2jI', 'weekly view').nikoEntries()
  entriesWithValues.forEach((item, index)=> nikoFrame.addNikoEntry(item, index + 1))

}
