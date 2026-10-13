import LoginPage from "./login-page";

class GoalsPage {
  constructor(page) {
    this.page = page;
    this.LoginPage = new LoginPage(page);
    this.goalCardHeader = page.locator(".goal-card h3");
  }

  getLoginPage() {
    return this.LoginPage;
  }

  async getLocatorTextContents(locator) {
    return locator.allTextContents();
  }
}

module.exports = GoalsPage;