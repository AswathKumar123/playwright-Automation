import { request, expect } from "@playwright/test";

const path = require("node:path");
const ExcelJS = require("exceljs");

const loginPayload = {
  username: "user001",
  password: "DemoPass!001",
};

class commonUtil {
  constructor() {
    this.apiContext = null;
    this.token = null;
    this.authPromise = null;
  }

  async ensureAuthenticated() {
    if (this.apiContext && this.token) return;

    this.authPromise ??= (async () => {
      this.apiContext = await request.newContext();

      const loginResponse = await this.apiContext.post(
        "https://financial-wellness-lab-2.onrender.com/api/auth/login",
        { data: loginPayload },
      );

      expect(loginResponse.ok()).toBeTruthy();

      const body = await loginResponse.json();
      this.token = body.accessToken;
    })();

    await this.authPromise;
  }

  async postApiContext(api, payload) {
    await this.ensureAuthenticated();
    const response = await this.apiContext.post(api, {
      data: payload,
      headers: { Authorization: `Bearer ${this.token}` },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    return response;
  }

  async patchApiContext(api, payload) {
    await this.ensureAuthenticated();
    const response = await this.apiContext.patch(api, {
      data: payload,
      headers: { Authorization: `Bearer ${this.token}` },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    return response;
  }

  async getApiContext(api) {
    await this.ensureAuthenticated();
    const response = await this.apiContext.get(api, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    return response;
  }

  async readExcel(
    filePath = path.resolve(__dirname, "../excel/Harbor_Excel_Practice.xlsx"),
  ) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    return workbook;
  }

  getExcel(worksheet, existingCellValue) {
    expect(worksheet).toBeDefined();

    let targetCell;
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (!targetCell && cell.value === existingCellValue) {
          targetCell = cell;
        }
      });
    });

    if (!targetCell) {
      throw new Error(
        `Could not find a cell containing "${existingCellValue}"`,
      );
    }

    return targetCell;
  }

  async writeExcel(workbook, outputFilePath) {
    await workbook.xlsx.writeFile(outputFilePath);
  }
}

module.exports = commonUtil;
