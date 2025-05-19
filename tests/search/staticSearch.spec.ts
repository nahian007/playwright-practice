import { test, expect, Locator, Page, Browser } from '@playwright/test';

let SearchInput: Locator;
let globalBrowser: Browser;

test.beforeAll(async ({ browser }) => {
  globalBrowser = browser;
});


// Navigate to Amazon before each test
test.beforeEach(async ({ page }) => {
  await page.goto('https://www.amazon.in/');
});

// Search product function
async function searchProduct(page: Page, productName: string) {
  SearchInput = page.locator('#nav-search').getByPlaceholder('Search Amazon.in');
  await SearchInput.click();
  await SearchInput.fill(productName);
  await page.locator('.autocomplete-results-container #sac-suggestion-row-1').click();
}

// Get product details
async function getProducts(page: Page, count: number) {
  const searchResults = page.locator('[data-component-type="s-search-result"]');
  await searchResults.first().waitFor({ state: 'visible' });

  const productDetails: { productTitle: string | null; productDescription: string | null; productPrice: string | null }[] = [];

  for (let i = 0; i < count; i++) {
    const productItem = searchResults.nth(i);

    const productTitle = await productItem.locator('[data-cy="title-recipe"]').getByRole('heading').first().textContent();
    const productDescription = await productItem.locator('[data-cy="title-recipe"]').getByRole('heading').nth(1).textContent();
    const productPrice = await productItem.locator('[data-cy="price-recipe"] [aria-describedby="price-link"] .a-price-whole').textContent();

    productDetails.push({ productTitle, productDescription, productPrice });
  }

  return productDetails;
}

// Unified test for multiple product searches
test('Search multiple products and extract details', async ({ page }) => {
  const searchItems = [
    { keyword: 'Kurti for Women', count: 3 },
    { keyword: 'shoes for man stylish', count: 5 },
  ];

  for (const { keyword, count } of searchItems) {
    await searchProduct(page, keyword);
    const productDetails = await getProducts(page, count);
    console.log(`Results for "${keyword}":`);
    console.log(productDetails);
    await page.goto('https://www.amazon.in/'); // Reset between searches
  }
});

// Close the browser after all tests
test.afterAll(async () => {
  await globalBrowser.close();
});