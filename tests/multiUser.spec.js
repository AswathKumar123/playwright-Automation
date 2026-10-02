const { test, expect } = require("@playwright/test");
const { getCertificateCompressionAlgorithms } = require("tls");

test.describe("Playwright Financial Wellness test", () => {
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

  test.skip("First Playwright Test", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://financial-wellness-lab-2.vercel.app/");

    await expect(page).toHaveTitle("Harbor | Financial wellness");
  });

  test.only("Validate homepage", async ({ page }) => {
    await test.step("Validate Overview", async () => {
      const overViewHeader = page.getByRole("tab", { name: "Overview" });

      const img = await overViewHeader.screenshot();

      expect(img).toMatchSnapshot('overViewHeaderImage.png')

      await expect(overViewHeader).toBeVisible({ timeout: 2000 });
    });

    const tabs = page.locator(".tab-strip");

    const tabTitles = await tabs.allTextContents();

    console.log(tabTitles[0]);

    expect(tabTitles[0]).toContain("OverviewOpen");

    tabTitles.find((value) => {
      value.includes("tabOverviewGoalsActivity");
    });

    tabTitles.filter((value) => {
      value.includes("OverviewOpen");
    });

    const cashFlowFilter = page.locator(
      '//*[@id="main"]/div[4]/section[1]/div[1]/label/select',
    );
    const cashFlowFilterCount = await cashFlowFilter.locator("option").count();

    for (let index = 0; index < cashFlowFilterCount; index++) {
      await cashFlowFilter.selectOption({ index });
    }
  });

  test("Validate new Browser tab", async ({ page }) => {
    await test.step("switch back to original tab", async () => {
      const link = page.locator('[href*="financial-well-being"]');
      const [newPage] = await Promise.all([
        page.waitForEvent("popup"),
        link.click(),
      ]);

      await newPage.waitForLoadState("domcontentloaded");
      const pages = page.context().pages();
      console.log(`Open tabs: ${pages.length}`);

      const expectedTab = (
        await Promise.all(
          pages.map(async (tab) => ({ tab, title: await tab.title() })),
        )
      ).find(({ title }) => title.includes("Harbor"))?.tab;
      await expectedTab.bringToFront();

      await page.goBack();
      await page.goForward();
    });
  });

  test("validate alert", async() => {
    const alert = await page.locator('footer button.text-action');
    await alert.click();

    page.on('dialog', dialog => dialog.accept());

      await alert.click();

    page.on('dialog', dialog => dialog.dismiss());

    await alert.hover();

    const frame = page.frameLocator('//*[@title="Financial wellness note"]');

    await frame.allTextContents();


  })
});
