import { Locator, Page, expect } from '@playwright/test';

export class searchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchResults: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#nav-search').getByPlaceholder('Search Amazon.in');
    this.searchResults = page.locator('[data-component-type="s-search-result"]');
  }

  async navigate() {
    await this.page.goto('https://www.amazon.in/');
  }

  async searchProduct(productName: string) {
    await this.searchInput.click();
    await this.searchInput.fill(productName);
    await this.page.locator('.autocomplete-results-container #sac-suggestion-row-1').click({ timeout: 10000 });
  }

  async getProducts(count: number) {
    await this.searchResults.first().waitFor({ state: 'visible' });

    const productDetails: {
      productTitle: string | null;
      productDescription: string | null;
      reviewCount: string | null;
    }[] = [];

    for (let i = 0; i < count; i++) {
      const productItem = this.searchResults.nth(i);

      const productTitle = await productItem
        .locator('[data-cy="title-recipe"]')
        .getByRole('heading')
        .first()
        .textContent();

      const productDescription = await productItem
        .locator('[data-cy="title-recipe"]')
        .getByRole('heading')
        .nth(1)
        .textContent();

      const reviewCount = await productItem
        .getByRole('link', { name: /ratings$/ })
        .locator('span.a-size-base.s-underline-text')
        .first()
        .textContent();

      productDetails.push({ productTitle, productDescription, reviewCount });
    }

    return productDetails;
  }

  async getProductDescriptions(count: number): Promise<(string | null)[]> {
  await this.searchResults.first().waitFor({ state: 'visible' });

  const descriptions: (string | null)[] = [];

  for (let i = 0; i < count; i++) {
    const description = await this.searchResults
      .nth(i)
      .locator('[data-cy="title-recipe"]')
      .getByRole('heading')
      .nth(1) // nth(1) is usually used for description
      .textContent();

    descriptions.push(description);
  }

  return descriptions;
}

  async runSearchTest({keyword,count,expectedKeyword,validationType,testCase,}: 
    {keyword: string; count: number; expectedKeyword?: string; validationType?: string; testCase: string;}) {
    await this.navigate();
    await this.searchProduct(keyword);

    if (validationType === 'descriptionCheck' && expectedKeyword) {
      const descriptions = await this.getProductDescriptions(5);
      console.log(`(${testCase}) Descriptions for "${keyword}":`);
      console.log(descriptions);
      for (const desc of descriptions) {
        expect(desc?.toLowerCase()).toContain(expectedKeyword.toLowerCase());
      }
      console.log(`(${testCase}) Description contains expected keyword "${expectedKeyword}"`);
    } else {
      const productDetails = await this.getProducts(count);
      console.log(`(${testCase}) Results for "${keyword}":`);
      console.log(productDetails);
    }
  }
}
