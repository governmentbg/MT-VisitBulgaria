import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:6006'

/**
 * Asserts that the page has no horizontal overflow (no horizontal scrollbar).
 * Checks that documentElement.scrollWidth does not exceed the viewport width.
 */
async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() => {
    const { scrollWidth } = document.documentElement
    const viewportWidth = window.innerWidth
    return { scrollWidth, viewportWidth }
  })
  expect(
    overflow.scrollWidth,
    `Horizontal overflow detected: scrollWidth (${overflow.scrollWidth}) > viewport (${overflow.viewportWidth})`,
  ).toBeLessThanOrEqual(overflow.viewportWidth)
}

// ─── Storybook carousel stories: no horizontal overflow ───

const carouselStories = [
  { name: 'Standard / Light', id: 'blocks-experiencelisting--standard-light' },
  { name: 'Standard / Dark', id: 'blocks-experiencelisting--standard-dark' },
  { name: 'Standard / Teal', id: 'blocks-experiencelisting--standard-teal' },
  { name: 'Standard / Dark + Month Filter', id: 'blocks-experiencelisting--standard-dark-with-month-filter' },
  { name: 'Overlay / Dark', id: 'blocks-experiencelisting--overlay-dark' },
  { name: 'Overlay / Teal', id: 'blocks-experiencelisting--overlay-teal' },
  { name: 'Overlay / Light', id: 'blocks-experiencelisting--overlay-light' },
  { name: 'Horizontal / Dark', id: 'blocks-experiencelisting--horizontal-dark' },
  { name: 'Horizontal / Teal', id: 'blocks-experiencelisting--horizontal-teal' },
  { name: 'Horizontal / Light', id: 'blocks-experiencelisting--horizontal-light' },
  { name: 'Horizontal / Teal + Month Filter', id: 'blocks-experiencelisting--horizontal-teal-with-month-filter' },
  { name: 'Standard / Cut Right', id: 'blocks-experiencelisting--standard-cut-right' },
  { name: 'Standard / Cut Left', id: 'blocks-experiencelisting--standard-cut-left' },
  { name: 'Overlay / Cut Right', id: 'blocks-experiencelisting--overlay-cut-right' },
  { name: 'Overlay / Cut Left + Standard Cards', id: 'blocks-experiencelisting--overlay-cut-left' },
  { name: 'Horizontal / Cut Right', id: 'blocks-experiencelisting--horizontal-cut-right' },
  { name: 'Horizontal / Cut Left', id: 'blocks-experiencelisting--horizontal-cut-left' },
  { name: 'Overlay / Watermark Right', id: 'blocks-experiencelisting--overlay-watermark-right' },
  { name: 'Horizontal / Watermark Right', id: 'blocks-experiencelisting--horizontal-watermark-right' },
]

const galleryStories = [
  { name: 'Default', id: 'components-gallerycarousel--default' },
  { name: 'Many Images', id: 'components-gallerycarousel--many-images' },
]

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'wide', width: 1920, height: 1080 },
]

test.describe('No horizontal overflow on carousels (Storybook)', () => {
  for (const story of carouselStories) {
    for (const vp of viewports) {
      test(`${story.name} @ ${vp.name} (${vp.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await page.goto(`${BASE_URL}/iframe.html?id=${story.id}&viewMode=story`)
        // Wait for carousel slides to render
        await page.locator('[class*="embla"], [class*="flex"]').first().waitFor({ timeout: 15000 })
        await expectNoHorizontalOverflow(page)
      })
    }
  }
})

test.describe('No horizontal overflow on gallery carousels (Storybook)', () => {
  for (const story of galleryStories) {
    for (const vp of viewports) {
      test(`${story.name} @ ${vp.name} (${vp.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await page.goto(`${BASE_URL}/iframe.html?id=${story.id}&viewMode=story`)
        await page.locator('[class*="embla"], [class*="flex"]').first().waitFor({ timeout: 15000 })
        await expectNoHorizontalOverflow(page)
      })
    }
  }
})
