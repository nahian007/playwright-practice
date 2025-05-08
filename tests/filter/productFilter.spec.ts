import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.amazon.in/');
})

test('Filter Product', async ({ page }) => {
  
  const brandName = 'Samsung';
  await page.locator('#nav-xshop-container').getByRole('link', { name: 'Mobiles' }).click();
  await page.waitForTimeout(5000);
  
  const selectedBrand = page.locator('.a-section [aria-labelledby="p_123-title"]').getByRole('listitem').filter({ hasText: brandName });
  await selectedBrand.scrollIntoViewIfNeeded();
  await selectedBrand.getByRole('link', { name: brandName }).click();
      
    //await page.waitForTimeout(1000);

    const firstSeller = page.locator('.a-section [aria-labelledby="p_6-title"]').getByRole('listitem').first();
    //const sellerValue = await firstBrand.textContent();
    await firstSeller.getByRole('checkbox').check({ force: true });

    const searchResults = await page.locator('[data-component-type="s-search-result"]');
    await searchResults.first().waitFor({ state: 'visible' });

    const productTitles = page.locator('[data-cy="title-recipe"]').getByRole('heading');
    
    const titleElements = await productTitles.all();

    // Retrieve all titles and verify each contains the word 'Samsung'
    for (const titleElement of titleElements) {

      const titleText = await titleElement.textContent();
      await expect(titleElement).toHaveText(new RegExp(brandName, 'i'));

    }
});
