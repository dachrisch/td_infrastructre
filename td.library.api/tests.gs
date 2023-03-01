if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
} // Class GasTap is ready for use now!


function testAddQuery(_test) {
  var test = _test || new GasTap()

  test('add empty Query ', function (t) {
    t.equal('http://test1.de', 'http://test1.de'.addQuery(), 'empty argument doesnt change url')
  });


  test('add one Query argument ', function (t) {
    let tString = 'http://test1.de'

    t.equal('http://test1.de?t=1', tString.addQuery({ t: 1 }), 'adds parameter t=1')
  });
}

function play() {
  let cloudApiConnector = new ApiConnector('https://techdivision.atlassian.net/rest/api/2/issue', 'token')
  // new: curl --user "c.daehn@techdivision.com:token" https://techdivision.atlassian.net/rest/api/2/issue/ITS-107
  console.log(cloudApiConnector.on('ITS-107').fetch())
}
