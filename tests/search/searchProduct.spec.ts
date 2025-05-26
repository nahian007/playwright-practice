import { test } from '@playwright/test';
import { searchPage } from '../../page-classes/searchPage.ts';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Helper: Read CSV
function readCSV(filePath: string) {
  const fileContent = fs.readFileSync(filePath);
  const dataRecords = parse(fileContent, {
    columns: true, // Get headers
    skip_empty_lines: true,
  });
  return dataRecords;
}

test('Search products from CSV and extract details', async ({ page }) => {
  const productSearchOption = new searchPage(page);

  const csvFilePath = path.join(__dirname, '../../test-data/searchData.csv');
  const searchItems: { keyword: string; count: string }[] = readCSV(csvFilePath);

  for (const { keyword, count } of searchItems) {
    await productSearchOption.navigate();
    await productSearchOption.searchProduct(keyword);
    const productDetails = await productSearchOption.getProducts(Number(count));
    console.log(`Results for "${keyword}":`);
    console.log(productDetails);
  }
});
