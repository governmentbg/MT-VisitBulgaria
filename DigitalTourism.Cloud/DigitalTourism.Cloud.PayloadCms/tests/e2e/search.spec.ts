import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Search page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/en/search`)
  })

  test('renders search input', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first()
    await expect(searchInput).toBeVisible()
  })

  test('displays results on load', async ({ page }) => {
    const results = page.locator('[data-testid="search-results"]')
    await expect(results).toBeVisible({ timeout: 10000 })
  })

  test('search filters results', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first()
    await searchInput.fill('hotel')
    // Wait for debounced search
    await page.waitForTimeout(500)
    const results = page.locator('[data-testid="search-results"]')
    await expect(results).toBeVisible({ timeout: 10000 })
  })

  test('filter sidebar visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    const sidebar = page.locator('aside').first()
    await expect(sidebar).toBeVisible()
  })

  test('filter drawer trigger visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first()
    await expect(filterButton).toBeVisible()
  })

  test('sort dropdown works', async ({ page }) => {
    const sortSelect = page.locator('select').first()
    await expect(sortSelect).toBeVisible()
    await sortSelect.selectOption('title:asc')
  })

  test('cards render with ExperienceCardAdapter (horizontal variant)', async ({ page }) => {
    const results = page.locator('[data-testid="search-results"]')
    await expect(results).toBeVisible({ timeout: 10000 })
    // Horizontal cards should be present
    const cards = results.locator('> div')
    await expect(cards.first()).toBeVisible()
  })
})
