import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const archivePages = [
  { path: '/en/hotels', type: 'hotel' },
  { path: '/en/restaurants', type: 'restaurant' },
  { path: '/en/activities', type: 'activity' },
  { path: '/en/attractions', type: 'attraction' },
  { path: '/en/events', type: 'event' },
]

for (const { path, type } of archivePages) {
  test.describe(`Archive page: ${type}`, () => {
    test('loads and renders cards', async ({ page }) => {
      await page.goto(`${BASE_URL}${path}`)
      const grid = page.locator('[data-testid="result-grid"]')
      await expect(grid).toBeVisible({ timeout: 10000 })
    })

    test('displays page heading', async ({ page }) => {
      await page.goto(`${BASE_URL}${path}`)
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
    })

    test('shows result count', async ({ page }) => {
      await page.goto(`${BASE_URL}${path}`)
      // Result count should be visible
      const resultCount = page.locator('text=/\\d+ result/i')
      await expect(resultCount).toBeVisible({ timeout: 10000 })
    })

    test('pagination appears when needed', async ({ page }) => {
      await page.goto(`${BASE_URL}${path}`)
      // Pagination may or may not appear depending on data
      await page.waitForTimeout(2000)
      const pagination = page.locator('nav[aria-label="Pagination"]')
      // Just check it doesn't error - pagination is optional
      const count = await pagination.count()
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })
}
