require('chromedriver');
const { Builder, Capabilities } = require('selenium-webdriver');
const { setWorldConstructor, setDefaultTimeout } = require('cucumber');

const chromeCapabilities = Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {
  args: ['--headless', '--disable-gpu', '--start-maximized']
});

function Init() {
  this.driver = new Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .build();
  setDefaultTimeout(20 * 1000);
}

setWorldConstructor(Init);
