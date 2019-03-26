const Page = require('./page');
const { By } = require('selenium-webdriver');
class AuthPage extends Page {
  constructor(driver) {
    super(driver);
    this.open(process.env.TEST_URL);
  }

  get email() {
    return this.find(By.id('email'));
  }

  get password() {
    return this.find(By.id('password'));
  }

  get asyncError() {
    return this.asyncFind(By.id('error'));
  }

  set email(email) {
    this.type(this.email, email);
  }

  set password(password) {
    this.type(this.password, password);
  }

  submitForm() {
    return this.email.submit();
  }
}

module.exports = AuthPage;
