import { test, expect } from '@playwright/test'

import { customTest } from '../utils/fixture'

customTest('The api test', async({api}) => {

   const response = api
    .url('https://financial-wellness-lab-2.onrender.com')
    .path('/api/goals')
    .headers({
        Authorization: `Bearer 59cc66749cae4189b0d38e02703df64a`
    });
    console.log(response.body);


})