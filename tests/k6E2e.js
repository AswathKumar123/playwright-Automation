import { check } from "k6";
import http from "k6/http";
import { sleep } from "k6";
import { group } from "k6";

const BASE_URL = "https://quickpizza.grafana.com";

// export const options = {
//   vus: 1,
//   duration: "3s",
// };

export const options = {
  vus: 3,
  duration: "10s",
  cloud: {
    projectID: 8489000,
    name: 'K6 E2E',
    distribution: {
      ashburn: { loadZone: "amazon:us:ashburn", percent: 100 },
    },
  },
};

function randomString(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let res = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    res += charset[randomIndex];
  }

  return res;
}

export default function () {
  let userRegistered = false;
  const registerPayload = {
    username: `aswath${randomString(7)}`,
    password: "123abcd",
  };

  group("User registration", function () {
    const params = {
      headers: { "Content-Type": "application/json" },
    };

    const response = http.post(
      `${BASE_URL}/api/users`,
      JSON.stringify(registerPayload),
      params,
    );

    userRegistered = check(response, {
      "response code was 201": (response) => {
        return response.status === 201;
      },
    });

    if (!userRegistered) {
      console.error(
        `User registration failed. ${response.status} - ${response.body}`,
      );
    }

    sleep(1);
  });

  group("Login", function () {
    let userAuthenticated = false;
    const loginResponse = http.post(
      `${BASE_URL}/api/users/token/login`,
      JSON.stringify(registerPayload),
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    userAuthenticated = check(loginResponse, {
      "login response is 200": (r) => r.status === 200,
      "login response contains token": (r) => r.json("token") !== undefined,
      "token is valid string ": (r) => r.json("token").length > 4,
    });

    if (userAuthenticated) {
      authToken = loginResponse.json("token");
      console.log(`user authenticated successfully: ${username}`);
    } else {
      console.log(
        `user authenticated failed ${response.status} - ${response.body}`,
      );
    }
  });
}
