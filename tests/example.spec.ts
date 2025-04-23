import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://www.amazon.in/');

  // Search With Product Name
  await page.locator('#nav-search').getByPlaceholder('Search Amazon.in').click()
  await page.locator('#nav-search').getByPlaceholder('Search Amazon.in').fill('kurti for woman')

  // Click on First Result
  await page.locator('.autocomplete-results-container #sac-suggestion-row-1').click()

});