import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { json } from 'node:stream/consumers';

test.describe("Verify the UI and APi", async () => {
  test.beforeEach("Login to app", async ({ page }) => {
    await page.goto("https://financial-wellness-lab-2.vercel.app/");

    await test.step("Login to homepage", async () => {
      //await page.locator('#username').click();
      await page.locator("#password").fill("DemoPass!001");
      await page.locator(".login-submit").click();
      await page.waitForTimeout(2000);
    });
  });

test('Basic Full page accessiblity', async({page}) => {

  const results = await new AxeBuilder({page}).analyze();
  //expect(results.violations).toEqual([]);

  console.log(results.violations);

  console.log("The total violation is ", results.violations.length);

  for(let violation of results.violations){
    console.log(`\nThe rule: ${violation.id}`);
    console.log(`The impact is ${violation.impact}`);
    console.log(`The description is ${violation.description}`);
  }
})

test('Specific A11y scan', async({page}) => {

  const results = await new AxeBuilder({page}).include('#main').analyze();
  //expect(results.violations).toEqual([]);

  console.log("The total violation is ", results.violations.length);

  for(let violation of results.violations){
    console.log(`\nThe rule: ${violation.id}`);
    console.log(`The impact is ${violation.impact}`);
    console.log(`The description is ${violation.description}`);
  }
})

test('Specific exclude A11y scan', async({page}) => {

  const results = await new AxeBuilder({page}).exclude('#main')
  .exclude('.topbar')
  .analyze();
  //expect(results.violations).toEqual([]);

  console.log("The total violation is ", results.violations.length);

  for(let violation of results.violations){
    console.log(`\nThe rule: ${violation.id}`);
    console.log(`The impact is ${violation.impact}`);
    console.log(`The description is ${violation.description}`);
  }
})

test('Specific wcag A11y scan', async({page}) => {

  const results = await new AxeBuilder({page}).withTags([
    'cat.color',
    'wcag2aa'
  ])
  .analyze();
  //expect(results.violations).toEqual([]);

  console.log("The total violation is ", results.violations.length);

  for(let violation of results.violations){
    console.log(`\nThe rule: ${violation.id}`);
    console.log(`The impact is ${violation.impact}`);
    console.log(`The description is ${violation.description}`);
  }
})

test('Disable Specific wcag A11y scan', async({page}) => {

  const results = await new AxeBuilder({page}).disableRules([
    'landmark-one-main'
  ])
  .analyze();
  //expect(results.violations).toEqual([]);

  console.log("The total violation is ", results.violations.length);

  for(let violation of results.violations){
    console.log(`\nThe rule: ${violation.id}`);
    console.log(`The impact is ${violation.impact}`);
    console.log(`The description is ${violation.description}`);
  }
})

test.only("Attach the report", async({page}, testInfo) => {
     const results = await new AxeBuilder({page}).analyze();
    await testInfo.attach('AccessbilityReport.json', {
        body: JSON.stringify(results),
        contentType: 'application/json'
    })
    console.log("Accessibility report generated")
})

});