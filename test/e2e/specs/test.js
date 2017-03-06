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
      // .assert.elementPresent('.hello')
      // .assert.containsText('h1', 'UnoBuilder App')
      // .assert.elementCount('img', 1)
      .source(function (result){
        // Source will be stored in result.value
        console.log(result.value);
      })
      .waitForElementVisible('body', 60000) 
      .waitForElementVisible('#uno-builder', 60000) 
      .waitForElementVisible('.uno-builder', 60000) 
      .waitForElementVisible('div', 60000) 
      .end()
  }
}
