import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.amazon.in/');
})

test('Filter Product', async ({ page }) => {
    await page.locator('#nav-xshop-container').getByRole('link', { name: 'Mobiles' }).click();
    await page.waitForTimeout(5000);

    const firstBrand = page.locator('.a-section [aria-labelledby="p_123-title"]').getByRole('listitem').nth(0);
    const brandValue = await firstBrand.textContent();
    await firstBrand.getByRole('checkbox').check({ force: true });

    await page.waitForTimeout(1000);

    const firstSeller = page.locator('.a-section [aria-labelledby="p_6-title"]').getByRole('listitem').first();
    const sellerValue = await firstBrand.textContent();
    await firstSeller.getByRole('checkbox').check({ force: true });

    const searchResults = await page.locator('[data-component-type="s-search-result"]');
    await searchResults.first().waitFor({ state: 'visible' });

    const productTitles = page.locator('[data-cy="title-recipe"]').getByRole('heading');
    
    const titleElements = await productTitles.all();

    // Retrieve all titles and verify each contains the word 'Apple'
    for (const titleElement of titleElements) {

      const titleText = await titleElement.textContent();
      //console.log(titleText);
      await expect(titleElement).toHaveText((/|iPhone/i));

      
    }
});
