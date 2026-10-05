import { test, request, expect } from "@playwright/test";

import commonUtil from "../utils/common-util";

import { validator, validateSchema } from "../utils/schema-validator";

const loginPayload = {
  username: "user001",
  password: "DemoPass!001",
};

const retirementPayload = {
  monthlyContribution: 500,
  targetDate: "2027-10-01",
};

let token;
let apiContext;

let commonUtils =new commonUtil(apiContext, token);


test.beforeAll("Capture the network call", async () => {
  apiContext = await request.newContext();

  const loginResponse = await apiContext.post(
    "https://financial-wellness-lab-2.onrender.com/api/auth/login",
    { data: loginPayload },
  );

  console.log("The login response is /n", loginResponse);

  expect(loginResponse.ok()).toBeTruthy();
  expect(loginResponse.status()).toBe(200);

  const response = await loginResponse.json();

  token = await response.accessToken;

  console.log(`The token is ${token}`);

  const user = await JSON.stringify(response.user);

  console.log(`The user values are ${user}`);

  commonUtils = new commonUtil(apiContext, token);
});

test.describe("Api Tests for Financial Wellness", async () => {
  test.beforeEach("has the expected homepage title", async ({ page }) => {
    await page.goto("https://financial-wellness-lab-2.vercel.app/");

    await expect(page).toHaveTitle("Harbor | Financial wellness");

    await test.step("Invalid Password Validation homepage", async () => {
      await page.locator("#username").click();
      const users = await page.locator("#username option");
      const userCount = await users.count();

      for (let i = 0; i < userCount && i < 5; i++) {
        await page.locator("#username").selectOption({ index: i });
        await page.locator("#password").fill("xxxx");
        await page.locator(".login-submit").click();

        const errorInline = page.locator('[role="alert"]');
        await expect(errorInline).toHaveText(
          "Invalid demo username or password",
        );
      }
    });

    await test.step("Login to homepage", async () => {
      //await page.locator('#username').click();
      await page.locator("#password").fill("DemoPass!005");
      await page.locator(".login-submit").click();
    });
  });

  test("Test retirement path Api", async () => {
    apiContext = await request.newContext();

    const response = await apiContext.patch(
      "https://financial-wellness-lab-2.onrender.com/api/goals/retirement",
      {
        data: retirementPayload,
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    console.log(JSON.stringify(response.json()));
  });

  test.only("Test only the Goals Get APi", async() => {
    const response = await commonUtils.getApiContext('https://financial-wellness-lab-2.onrender.com/api/goals');
    await validator(await response.json(), "goals", "GET_goals");
    await validateSchema(await response.json(), "goals", 'Goals_GET');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  })

  test("Test Goals Get Api", async () => {
  

    const response = await commonUtils.getApiContext('https://financial-wellness-lab-2.onrender.com/api/recommendations?priority=all');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

  });

    test("Test Recommendation patch Api", async () => {
          
     await commonUtils.patchApiContext('https://financial-wellness-lab-2.onrender.com/api/goals/retirement', retirementPayload);

  });
});
