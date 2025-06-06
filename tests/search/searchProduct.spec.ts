import { test } from '@playwright/test';
import { searchPage } from '../../page-classes/searchPage';
import { readCSV } from '../../utils/utils';
import path from 'path';
import testData from '../../fixtures/testData.json';

// 1. Load master data (test case IDs to run)
const masterData = testData as unknown as { data: Record<string, string[]> };
const testCasesToRun = masterData.data.searchProduct; // e.g., ["search_001", "search_002"]


// 2. Load all rows from slave/test data
const csvFilePath = path.join(__dirname, '../../test-data/SearchProductData.csv');
const allSearchItems: { testCase: string; keyword: string; count: string }[] = readCSV(csvFilePath);
//const searchItems: { keyword: string; count: string }[] = readCSV(csvFilePath);

// 3. Filter only test cases listed in masterData
const filteredSearchItems = allSearchItems.filter(item =>
  testCasesToRun.includes(item.testCase)
);


// Generate one test per CSV row
for (const { keyword, count, testCase } of filteredSearchItems) {
  test(`(${testCase}) Search for "${keyword}" and get top ${count} results`, async ({ page }) => {
    const productSearch = new searchPage(page);
    await productSearch.runSearchTest(keyword, Number(count), testCase);
  });
}
