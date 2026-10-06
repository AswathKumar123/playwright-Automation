const base = require("@playwright/test");
import commonUtil from "../utils/common-util";
import { RequestHandler } from "./requestHandler";

const commonUtils = new commonUtil();
const requestHandlers = new RequestHandler();
const retirementPayload = {
  monthlyContribution: 500,
  targetDate: "2027-10-01",
};

exports.customTest = base.test.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto("https://financial-wellness-lab-2.vercel.app/");
    await page.locator("#password").fill("DemoPass!001");
    await page.locator(".login-submit").click();
    await page.waitForLoadState("networkidle");
    await use(page);
  },
  goalsRetirementFeature: async ({}, use) => {
    const response = await commonUtils.patchApiContext(
      "https://financial-wellness-lab-2.onrender.com/api/goals/retirement",
      retirementPayload,
    );
    await use(await response.json());
  },
  goalsGetApi: async ({}, use) => {
    const response = await commonUtils.getApiContext(
      'https://financial-wellness-lab-2.onrender.com/api/goals',
    );
    await use(await response.json());
  },
  api: async ({}, use) => {
    await use(requestHandlers);
  }


});
