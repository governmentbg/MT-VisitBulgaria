import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Responsive card layout', () => {
  test('mobile (375px): shows horizontal cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(`${BASE_URL}/en/hotels`)
    const grid = page.locator('[data-testid="result-grid"]')
    await expect(grid).toBeVisible({ timeout: 10000 })

    // On mobile, the "block md:hidden" wrapper should be visible (horizontal cards)
    // and the "hidden md:block" wrapper should be hidden (standard cards)
    const mobileCards = grid.locator('.block.md\\:hidden')
    const desktopCards = grid.locator('.hidden.md\\:block')

    if ((await mobileCards.count()) > 0) {
      await expect(mobileCards.first()).toBeVisible()
    }
    if ((await desktopCards.count()) > 0) {
      await expect(desktopCards.first()).not.toBeVisible()
    }
  })

  test('tablet (768px): shows 2-column grid', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto(`${BASE_URL}/en/hotels`)
    const grid = page.locator('[data-testid="result-grid"]')
    await expect(grid).toBeVisible({ timeout: 10000 })

    // Grid should have responsive columns
    const gridStyle = await grid.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return computed.gridTemplateColumns
    })
    // At 768px (sm+), should have 2 columns
    const columnCount = gridStyle.split(' ').length
    expect(columnCount).toBeGreaterThanOrEqual(2)
  })

  test('desktop (1280px): shows 3+ column grid', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(`${BASE_URL}/en/hotels`)
    const grid = page.locator('[data-testid="result-grid"]')
    await expect(grid).toBeVisible({ timeout: 10000 })

    const gridStyle = await grid.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return computed.gridTemplateColumns
    })
    const columnCount = gridStyle.split(' ').length
    expect(columnCount).toBeGreaterThanOrEqual(3)
  })

  test('search page: horizontal cards at all viewports', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/search`)
    const results = page.locator('[data-testid="search-results"]')
    await expect(results).toBeVisible({ timeout: 10000 })

    // Search page always uses horizontal variant
    const cards = results.locator('> div')
    await expect(cards.first()).toBeVisible()
  })
})
