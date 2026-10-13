class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator("#username");
    this.password = page.locator("#password");
    this.loginButton = page.locator(".login-submit");
  }

  async goToLoginPage(){
    await this.page.goto('https://financial-wellness-lab-2.vercel.app/');
  }

  async validLogin(password) {
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

module.exports = LoginPage;
