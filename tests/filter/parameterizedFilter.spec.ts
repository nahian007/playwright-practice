import { test, expect } from '@playwright/test';

const filterKey = process.env.filterKey || " ";
const brandName = process.env.brandName || " ";

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.amazon.in/');
});

test('Filter Product', async ({ page }) => {
  await page.locator('#nav-xshop-container').getByRole('link', { name: filterKey }).click();
  await page.waitForTimeout(5000);
  
  const selectedBrand = page.locator('.a-section [aria-labelledby="p_123-title"]')
    .getByRole('listitem')
    .filter({ hasText: brandName });
  
  await selectedBrand.scrollIntoViewIfNeeded();
  await selectedBrand.getByRole('link', { name: brandName }).click();

  const firstSeller = page.locator('.a-section [aria-labelledby="p_6-title"]').getByRole('listitem').first();
  await firstSeller.getByRole('checkbox').check({ force: true });

  const searchResults = page.locator('[data-component-type="s-search-result"]');
  await searchResults.first().waitFor({ state: 'visible' });

  const productTitles = page.locator('[data-cy="title-recipe"]').getByRole('heading');
  const titleElements = await productTitles.all();

  for (const titleElement of titleElements) {
    await expect(titleElement).toHaveText(new RegExp(brandName, 'i'));
  }
});
