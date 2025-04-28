import { test, expect, Locator } from '@playwright/test';
//import { console } from 'inspector';

let SearchInput: Locator;

test.beforeEach(async ({page}) => {
  await page.goto('https://www.amazon.in/');
})

// Keeping search product in a common function

async function searchPorduct(page, prodcutName:string) {
  
  SearchInput = page.locator('#nav-search').getByPlaceholder('Search Amazon.in')
  await SearchInput.click()
  await SearchInput.fill(prodcutName)
  await page.locator('.autocomplete-results-container #sac-suggestion-row-1').click()
  
}

// Keeping product iteration on a single common function

async function getProducts(page, count:number) {

  const searchResults = await page.locator('[data-component-type="s-search-result"]')
  await searchResults.first().waitFor({state: 'visible'})

  // Array declaration for keeping all product data
  const productDetails: {productTitle : string | null, productDescription : string | null, productPrice : string | null}[] = []

  // Loop for getting first three data
  for(let i = 0; i < 3; i++){
    const expectedProductValues = searchResults.nth(i)

    const productTitle = await expectedProductValues.locator('[data-cy="title-recipe"]').getByRole('heading').first().textContent()
    const productDescription = await expectedProductValues.locator('[data-cy="title-recipe"]').getByRole('heading').nth(1).textContent()
    const productPrice = await expectedProductValues.locator('[data-cy="price-recipe"] [aria-describedby="price-link"] .a-price-whole').textContent()

    productDetails.push({productTitle, productDescription, productPrice})
  }

  return productDetails;
  
}

test('Pull Text - Extract 3 data', async ({ page }) => {

  await searchPorduct(page, 'Kurti for Women');
  const productDetails = await getProducts(page, 3)
  console.log(productDetails)

})

test('Pull Text - Extract 5 data', async ({ page }) => {
  
  await searchPorduct(page, 'shoes for man stylish');
  const productDetails = await getProducts(page, 5)
  console.log(productDetails)

})