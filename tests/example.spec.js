const { test, expect } = require("@playwright/test");


test.describe('Playwright Financial Wellness test', () => {
    test.beforeEach('has the expected homepage title', async ({ page }) => {
        await page.goto('https://financial-wellness-lab-2.vercel.app/');

        await expect(page).toHaveTitle('Harbor | Financial wellness');

             await test.step('Invalid Password Validation homepage', async() => {
                        //await page.locator('#username').click();
                        await page.locator('#password').fill('xxxx');
                        await page.locator('.login-submit').click();

                        const errorInline = page.locator('[role="alert"]');

                       const invalidMsg = await errorInline.textContent();

                        await expect(errorInline).toBeVisible();

                        await expect(errorInline).toHaveText(invalidMsg);

                        await expect(invalidMsg).toMatch('Invalid demo username or password');
        })

         await test.step('Login to homepage', async() => {
                        //await page.locator('#username').click();
                        await page.locator('#password').fill('DemoPass!001');
                        console.log("the text content", await page.locator('#password').allTextContents());
                        console.log("the value content", await page.locator('#password').inputValue());
                        await page.locator('.login-submit').click();
                        await page.waitForLoadState('networkidle')
        })

    });


test('First Playwright Test', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:5173/');

    await expect(page).toHaveTitle('Harbor | Financial wellness');

});

test('Validate homepage', async ({page}) => {

   
    await test.step('Validate Overview', async() => {
    const overViewHeader = page.getByRole('tab', {name: 'Overview'});

         await expect(overViewHeader).toBeVisible({timeout: 2000});
    })    
   

    const tabs = page.locator('.tab-strip');

    const tabTitles = await tabs.allTextContents();

    console.log(tabTitles[0]);

    expect(tabTitles[0]).toContain('OverviewOpen')

   
    tabTitles.find(value => {
        value.includes('tabOverviewGoalsActivity')
    })

      tabTitles.filter(value => {
        value.includes('OverviewOpen');
    })

});

});