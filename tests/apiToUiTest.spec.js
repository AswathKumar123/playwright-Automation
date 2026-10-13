import { test, expect, request } from "@playwright/test";

import commonUtil from "../utils/common-util";

import goalsMock from "../mocks/goalsMock.json"

import LoginPage from "../pages/login-page";

import GoalsPage from "../pages/goals-page";

let helper = new commonUtil();



test.describe("Verify the UI and APi", () => {
  test.describe.configure({ mode: "parallel" });
  test.beforeEach("Login to app", async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.goToLoginPage();

    await test.step("Login to homepage", async () => {
      const loginpage = new LoginPage(page);
    
      //await page.locator('#username').click();
      await loginpage.validLogin("DemoPass!001");
    });
  });

  test(`Validate api value with UI @api`, async ({ page }) => {
    const goalsPage = new GoalsPage(page);
    const goalCardHeader = await goalsPage.getLocatorTextContents(goalsPage.goalCardHeader);

    const labels = await helper.getApiContext(
      "https://financial-wellness-lab-2.onrender.com/api/goals",
    );
    const response = await labels.json();

    const title = await response.map(response => response.title);

    expect(goalCardHeader).toEqual(title);

    //Map
    const goalId = response.map(goals => goals.target);

    expect(goalId[1]).toBe(20000);

    //Set
    const detectDuplicateTargetAmount = new Set(goalId);

    expect(goalId.length).toEqual(detectDuplicateTargetAmount.size);


    //Map key, value
    const goalsById = new Map(response.map(goal => [goal.id, goal]));
    const retirementGoal = goalsById.get('retirement');

    expect(retirementGoal.target).toBe(500000);
    
  });


  test(`Intercept Network apis @intercept`, async({page}) => {
    await page.route('https://financial-wellness-lab-2.onrender.com/api/goals', route => {
        route.fulfill({
            status:200,
            contentType: 'application/json',
            body: JSON.stringify(goalsMock)

        })
    });

   // await page.route('https://financial-wellness-lab-2.onrender.com/api/recommendations?priority=all', route => route.abort());

    await page.reload();

     await expect(page.locator(".goal-card h3")).toHaveText(goalsMock.map(goals => goals.title));
});
});
