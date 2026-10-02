import { test } from "@playwright/test";
import { writeFile } from 'node:fs/promises';

test("Capture the Session Storage", async ({ browser, page }) => {
  const context = await browser.newContext();

  await page.goto("https://financial-wellness-lab-2.vercel.app/");

  await test.step('Login to homepage', async() => {
                          //await page.locator('#username').click();
                          await page.locator('#password').fill('DemoPass!001');
                          await page.locator('.login-submit').click();
          })

    await test.step('Store the session', async() => {
        await page.waitForLoadState('networkidle');
        await context.storageState({path: 'State.json'});

        const sessionStorage = await page.evaluate(() => 
        Object.fromEntries(
            Array.from({length: window.sessionStorage.length}, (_,index) => {
                const key = window.sessionStorage.key(index);
                return [key,window.sessionStorage.getItem(key)];
            })
        ))
        await writeFile('session.json', JSON.stringify(sessionStorage, null, 2));
    })      
    
});
