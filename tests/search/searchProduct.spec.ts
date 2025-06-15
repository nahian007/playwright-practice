import { test } from '@playwright/test';
import { searchPage } from '../../page-classes/searchPage';
import { readCSV } from '../../utils/utils';
import path from 'path';
import testData from '../../fixtures/testData.json';

// 1. Load master data (test case IDs to run)
const masterData = testData as unknown as { data: Record<string, string[]> };
const testCasesToRun = masterData.data.searchProduct;

// 2. Load all rows from CSV
const csvFilePath = path.join(__dirname, '../../test-data/searchProductData.csv');
const allSearchItems: {
  testCase: string;
  keyword: string;
  count: string;
  expectedKeyword?: string;
  validationType?: string;
}[] = readCSV(csvFilePath);

// 3. Filter test cases to run
const filteredSearchItems = allSearchItems.filter(item =>
  testCasesToRun.includes(item.testCase)
);

// 4. Dynamically create tests
for (const { testCase, keyword, count, expectedKeyword, validationType } of filteredSearchItems) {
  test(`(${testCase}) ${validationType === 'titleCheck' ? 'Title check' : 'Search'} for "${keyword}"`, async ({ page }) => {
    const productSearchOption = new searchPage(page);

    await productSearchOption.runSearchTest({
      keyword,
      count: Number(count),
      expectedKeyword,
      validationType,
      testCase,
    });
  });
}
