const { By } = require('selenium-webdriver');
const { Given, When, Then } = require('cucumber');
const AuthPage = require('../page-objects/auth');

Given('Eu estou na pagina de login', function() {
  this.page = new AuthPage(this.driver);
});

When('Eu digito o email {string}', function(email) {
  this.page.email = email;
});

When('Eu digito a senha {string}', function(password) {
  this.page.password = password;
});

When('Eu clico submit', function() {
  return this.page.submitForm();
});

Then('Eu devo ver o botao de logout', async function() {
  return (await this.page.asyncFind(By.id('logout'))).isDisplayed();
});

Then('Eu devo ver o erro de senha', async function() {
  return (await this.page.asyncError).isDisplayed();
});
