import { test, expect, request } from "@playwright/test";

import commonUtil from "../utils/common-util";

import goalsMock from "../mocks/goalsMock.json"

let helper = new commonUtil();

test.describe("Verify the UI and APi", async () => {
  test.beforeEach("Login to app", async ({ page }) => {
    await page.goto("https://financial-wellness-lab-2.vercel.app/");

    await test.step("Login to homepage", async () => {
      //await page.locator('#username').click();
      await page.locator("#password").fill("DemoPass!001");
      await page.locator(".login-submit").click();
    });
  });

  test("Validate api value with UI", async ({ page }) => {
    const goalCardHeader = await page
      .locator(".goal-card h3")
      .allTextContents(); 

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


  test('Intercept Network apis', async({page}) => {
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
