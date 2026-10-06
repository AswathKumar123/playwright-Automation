import { test, expect } from '@playwright/test'

const loginPayload = {username: "user001", password: "DemoPass!001"}
const postPayload = {
    "title": "home",
    "category": "savings",
    "current": 1000,
    "target": 10000,
    "monthlyContribution": 200,
    "targetDate": "2030-01-03",
    "icon": "shield"
}

const putPayload = {
    "title": "College savings",
    "category": "savings",
    "current": 7220,
    "target": 60000,
    "monthlyContribution": 301,
    "targetDate": "2042-08-01",
    "icon": "shield"
}

async function getToken(request) {
  const api = await request.post('https://financial-wellness-lab-2.onrender.com/api/auth/login', {data: loginPayload});
  expect(api.ok()).toBeTruthy();
  expect(api.status()).toBe(200);
  const response = await api.json();
  expect(response.accessToken).toBeTruthy();
  return response.accessToken;
}

test('Get call validation', async({request}) => {
   const accessToken = await getToken(request);
   const response = await request.get('https://financial-wellness-lab-2.onrender.com/api/goals', {headers: { Authorization: `Bearer ${accessToken}`}});

   console.log(await response.json());

   expect(response.status()).toEqual(200);

   expect((await response.json())[0].id).toEqual('college');

   expect((await response.json()).length).toBeLessThanOrEqual(5);

   expect(await response.json()).toEqual(expect.arrayContaining([
    expect.objectContaining({ title: expect.any(String)},)
   ]))
})

test('Post call validation', async({request}) => {
   const accessToken = await getToken(request);
   const response = await request.post('https://financial-wellness-lab-2.onrender.com/api/goals', {data: postPayload, headers: { Authorization: `Bearer ${accessToken}`}});

   console.log(await response.json());

   expect(response.status()).toEqual(201);

   expect((await response.json())[0].title).toEqual('home');

   expect((await response.json()).length).toBeLessThanOrEqual(1);

   expect(await response.json()).toEqual(expect.arrayContaining([
    expect.objectContaining({ category: expect.any(String)},)
   ]))
})

test('Put call validation', async({request}) => {
   const accessToken = await getToken(request);
   const response = await request.put('https://financial-wellness-lab-2.onrender.com/api/goals/college', {data: putPayload, headers: { Authorization: `Bearer ${accessToken}`}});

   console.log(await response.json());

   expect(response.status()).toEqual(200);
})

test('Delete call validation', async({request}) => {
   const accessToken = await getToken(request);
   const response = await request.delete('https://financial-wellness-lab-2.onrender.com/api/goals/1d7209bf38b341f685eb4c1cc01466e7', {headers: { Authorization: `Bearer ${accessToken}`}});

   console.log(await response.json());

   expect(response.status()).toEqual(200);
})