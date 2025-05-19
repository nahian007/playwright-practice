import { Locator, Page } from '@playwright/test';

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
    await this.page.locator('.autocomplete-results-container #sac-suggestion-row-1').click();
  }

  async getProducts(count: number) {
    await this.searchResults.first().waitFor({ state: 'visible' });

    const productDetails: { productTitle: string | null; productDescription: string | null; productPrice: string | null }[] = [];

    for (let i = 0; i < count; i++) {
      const productItem = this.searchResults.nth(i);

      const productTitle = await productItem.locator('[data-cy="title-recipe"]').getByRole('heading').first().textContent();
      const productDescription = await productItem.locator('[data-cy="title-recipe"]').getByRole('heading').nth(1).textContent();
      const productPrice = await productItem.locator('[data-cy="price-recipe"] [aria-describedby="price-link"] .a-price-whole').textContent();

      productDetails.push({ productTitle, productDescription, productPrice });
    }

    return productDetails;
  }
}
