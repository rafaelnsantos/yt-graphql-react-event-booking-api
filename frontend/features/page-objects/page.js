const { until } = require('selenium-webdriver');

module.exports = class Page {
  constructor(driver) {
    this.driver = driver;
  }

  async open(path) {
    await this.driver.get(path);
  }

  get title() {
    return this.driver.getTitle();
  }

  find(locator) {
    return this.driver.findElement(locator);
  }

  async asyncFind(locator) {
    await this.driver.wait(until.elementLocated(locator));
    return this.driver.findElement(locator);
  }

  type(input, text) {
    input.clear();
    input.sendKeys(text);
  }
};
