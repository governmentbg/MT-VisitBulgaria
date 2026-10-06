import { test, expect, type Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

/**
 * Embedded maps must never trap the page scroll on a phone. On touch/small
 * screens they render frozen with a "View map" button that opens the same map
 * full screen; on desktop they stay inline and interactive.
 */

/** The map only initialises once scrolled into view (IntersectionObserver). */
async function revealMap(page: Page) {
  const container = page.getByTestId('embedded-map').first()
  await expect(container).toBeAttached({ timeout: 15000 })
  await container.scrollIntoViewIfNeeded()
  await expect(page.locator('.leaflet-container').first()).toBeVisible({ timeout: 15000 })
}

/** Resolve a real experience detail URL rather than depending on a seeded slug. */
async function firstHotelUrl(page: Page): Promise<string> {
  await page.goto(`${BASE_URL}/en/hotels`)
  const grid = page.locator('[data-testid="result-grid"]')
  await expect(grid).toBeVisible({ timeout: 15000 })
  const href = await grid.locator('a[href*="/hotels/"]').first().getAttribute('href')
  expect(href, 'expected at least one hotel in the listing').toBeTruthy()
  return href!.startsWith('http') ? href! : `${BASE_URL}${href}`
}

test.describe('Embedded map — compact/touch', () => {
  // A plain setViewportSize would not set `pointer: coarse`; without hasTouch the
  // component would take the desktop path and these assertions would be vacuous.
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('renders a frozen preview with a full-screen button', async ({ page }) => {
    await page.goto(await firstHotelUrl(page))

    await revealMap(page)
    await expect(page.getByTestId('embedded-map-fullscreen').first()).toBeAttached()

    // Leaflet only adds these classes while its drag/zoom handlers are enabled.
    const map = page.locator('.leaflet-container').first()
    await expect(map).not.toHaveClass(/leaflet-grab/)
    await expect(map).not.toHaveClass(/leaflet-touch-drag/)
  })

  test('the button opens an interactive full-screen map, Escape closes it', async ({ page }) => {
    await page.goto(await firstHotelUrl(page))

    await revealMap(page)
    await page.getByTestId('embedded-map-fullscreen').first().click()

    const dialog = page.getByTestId('embedded-map-dialog')
    await expect(dialog).toBeVisible()

    // Same pins, now pannable and filling the viewport.
    const map = dialog.locator('.leaflet-container')
    await expect(map).toBeVisible()
    await expect(map).toHaveClass(/leaflet-grab/)
    expect(await dialog.locator('.leaflet-marker-icon').count()).toBeGreaterThan(0)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})

test.describe('Embedded map — desktop', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('stays inline and interactive, with no full-screen button', async ({ page }) => {
    await page.goto(await firstHotelUrl(page))

    await revealMap(page)
    const map = page.locator('.leaflet-container').first()
    await expect(map).toHaveClass(/leaflet-grab/)
    await expect(page.getByTestId('embedded-map-fullscreen')).toHaveCount(0)
  })
})

test.describe('Embedded map — crossing the breakpoint after mount', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  /**
   * react-leaflet only applies dragging/touchZoom when the map is created, and
   * React reuses the same DOM node across the breakpoint. Without an imperative
   * toggle a rotated phone left a frozen map with no way to open it.
   */
  test('handlers follow the viewport in both directions', async ({ page }) => {
    await page.goto(await firstHotelUrl(page))
    await revealMap(page)

    const map = page.locator('.leaflet-container').first()
    await expect(map).not.toHaveClass(/leaflet-grab/)

    await page.setViewportSize({ width: 1280, height: 900 })
    await expect(page.getByTestId('embedded-map-fullscreen')).toHaveCount(0)
    await expect(map).toHaveClass(/leaflet-grab/)

    await page.setViewportSize({ width: 390, height: 844 })
    await expect(page.getByTestId('embedded-map-fullscreen').first()).toBeAttached()
    await expect(map).not.toHaveClass(/leaflet-grab/)
  })
})
