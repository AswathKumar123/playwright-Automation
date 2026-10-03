const { test, expect } = require("@playwright/test");

import commonUtil from "../utils/common-util";

let helper;

test("reads the Practice worksheet from the Excel workbook", async ({}, testInfo) => {
  helper = new commonUtil();

  const workbook = await helper.readExcel();
  const worksheet = workbook.getWorksheet("Practice");

  const cell = helper.getExcel(worksheet, "Rules");
  cell.value = "New Rules";

  const outputFilePath = testInfo.outputPath("Harbor_Excel_Practice.xlsx");
  await helper.writeExcel(workbook, outputFilePath);

  const savedWorkbook = await helper.readExcel(outputFilePath);
  const savedCell = helper.getExcel(
    savedWorkbook.getWorksheet("Practice"),
    "New Rules",
  );

  expect(savedCell.address).toBe(cell.address);
  expect(savedCell.value).toBe("New Rules");
});
