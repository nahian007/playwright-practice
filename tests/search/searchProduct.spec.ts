// tests/search-multiple-products.spec.ts

import { test } from '@playwright/test';
import { searchPage } from '../../page-classes/searchPage.ts';

test('Search multiple products and extract details', async ({ page }) => {
  const productSearchOption = new searchPage(page);

  const searchItems = [
    { keyword: 'Kurti for Women', count: 3 },
    { keyword: 'shoes for man stylish', count: 5 },
  ];

  for (const { keyword, count } of searchItems) {
    await productSearchOption.navigate();
    await productSearchOption.searchProduct(keyword);
    const productDetails = await productSearchOption.getProducts(count);
    console.log(`Results for "${keyword}":`);
    console.log(productDetails);
  }
});
