import { test } from '@playwright/test';
import { searchPage } from '../../page-classes/searchPage';
import { readCSV } from '../../utils/utils';
import path from 'path';


const csvFilePath = path.join(__dirname, '../../test-data/searchData.csv');
const searchItems: { keyword: string; count: string }[] = readCSV(csvFilePath);

// Generate one test per CSV row
for (const { keyword, count } of searchItems) {
  test(`Search for "${keyword}" and get top ${count} results`, async ({ page }) => {
    const productSearchOption = new searchPage(page);

    await productSearchOption.navigate();
    await productSearchOption.searchProduct(keyword);
    const productDetails = await productSearchOption.getProducts(Number(count));
    console.log(`✅ Results for "${keyword}":`);
    console.log(productDetails);
  });
}
