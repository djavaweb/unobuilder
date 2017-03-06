// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementPresent('.uno-builder', 30000, false) 
      .getLog('browser', function(result) {
        result.forEach(function (value, key) {
          if(value.level === 'SEVERE') {
            console.error(value.message)
          }
        })
      })
      .end()
  }
}
