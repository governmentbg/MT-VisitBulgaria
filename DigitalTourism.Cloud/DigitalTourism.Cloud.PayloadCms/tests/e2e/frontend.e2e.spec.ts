import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let _page: Page

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    _page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Visit Bulgaria/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Travel to Bulgaria – Your Complete Official Tourism Guide')
  })
})
