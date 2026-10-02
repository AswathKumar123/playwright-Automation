import { test, request, expect } from '@playwright/test'

const loginPayload = {
  "username": "user001",
  "password": "DemoPass!001"
}

let session;

test.beforeAll('Capture the network call', async()=> {
    const apiContext = await request.newContext();

   const loginResponse = await apiContext.post('https://financial-wellness-lab-2.onrender.com/api/auth/login',{ data:loginPayload});

   console.log('The login response is /n', loginResponse);

   expect(loginResponse.ok()).toBeTruthy();
   expect(loginResponse.status()).toBe(200);

   const response = await loginResponse.json();

    session = response;

    console.log(`The token is ${session.accessToken}`);

    const user = JSON.stringify(response.user);

   console.log(`The user values are ${user}`);
})

 test('Add local storage', async({page}) => {
        await page.addInitScript(value => {
            window.sessionStorage.setItem('harborSession', JSON.stringify(value));
        }, session);

        await page.goto('https://financial-wellness-lab-2.vercel.app/')

       const value = await page.evaluate(() => window.sessionStorage.getItem('harborSession'));

        console.log('Session storage value:', value);
        expect(value).not.toBeNull();
        await expect(page.locator('.login-submit')).toHaveCount(0);

    })