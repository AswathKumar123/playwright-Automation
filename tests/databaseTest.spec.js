import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { Pool } from 'pg';

const db = new Pool({
  max: 2,
  connectionTimeoutMillis: 5000,
});

test.afterAll(async () => {
  await db.end();
});

test('user001 has the expected retirement goal', async () => {
  const result = await db.query(
    `SELECT category, target_amount, monthly_contribution
     FROM goals
     WHERE user_id = $1 AND goal_id = $2`,
    ['user001', 'retirement']
  );

  console.log(result);

  expect(result.rows).toHaveLength(1);

  const goal = result.rows[0];

  expect(goal.category).toBe('retirement');
  expect(Number(goal.target_amount)).toBe(500000);
  expect(goal.monthly_contribution).toBe(951);
});

test('API goal update is saved in PostgreSQL', async ({ request }) => {
  const api = 'https://financial-wellness-lab-2.onrender.com';

  const login = await request.post(`${api}/api/auth/login`, {
    data: {
      username: 'user001',
      password: 'DemoPass!001',
    },
  });
  expect(login.ok()).toBeTruthy();

  const { accessToken } = await login.json();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const goalsResponse = await request.get(`${api}/api/goals`, {
    headers,
  });
  expect(goalsResponse.ok()).toBeTruthy();

  const original = (await goalsResponse.json()).find(
    (goal) => goal.id === 'retirement'
  );
  expect(original).toBeDefined();

  const updatedContribution =
    original.monthlyContribution === 1200 ? 1201 : 1200;

  try {
    const update = await request.patch(
      `${api}/api/goals/retirement`,
      {
        headers,
        data: {
          monthlyContribution: updatedContribution,
          targetDate: original.targetDate,
        },
      }
    );
    expect(update.ok()).toBeTruthy();

    await expect.poll(async () => {
      const result = await db.query(
        `SELECT monthly_contribution
         FROM goals
         WHERE user_id = $1 AND goal_id = $2`,
        ['user001', 'retirement']
      );

      return result.rows[0]?.monthly_contribution;
    }, { timeout: 5000 }).toBe(updatedContribution);
  } finally {
    const restore = await request.patch(
      `${api}/api/goals/retirement`,
      {
        headers,
        data: {
          monthlyContribution: original.monthlyContribution,
          targetDate: original.targetDate,
        },
      }
    );
    expect(restore.ok()).toBeTruthy();
  }
});