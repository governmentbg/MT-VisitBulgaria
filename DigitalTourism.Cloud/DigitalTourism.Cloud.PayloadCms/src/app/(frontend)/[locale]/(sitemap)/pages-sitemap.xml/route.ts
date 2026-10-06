import { getServerSideSitemap } from 'next-sitemap'
import { getPayloadClient } from '@/payload/payloadClient'
import { unstable_cache } from 'next/cache'
import localization from '@/i18n/localization'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 1, // Need depth to access breadcrumbs
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        breadcrumbs: true, // Include breadcrumbs for full URL
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()
    const locales = localization.locales.map((l) => l.code)

    // Generate sitemap entries for all locales
    const defaultSitemap = locales.flatMap((locale) => [
      {
        loc: `${SITE_URL}/${locale}/search`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/${locale}/posts`,
        lastmod: dateFallback,
      },
    ])

    const sitemap = results.docs
      ? results.docs
          .filter((page: any) => Boolean(page?.slug))
          .flatMap((page: any) => {
            // Get full path from breadcrumbs or use slug
            let pagePath: string
            if (page?.slug === 'home') {
              pagePath = ''
            } else if (
              page?.breadcrumbs &&
              Array.isArray(page.breadcrumbs) &&
              page.breadcrumbs.length > 0
            ) {
              const lastBreadcrumb = page.breadcrumbs[page.breadcrumbs.length - 1] as {
                url?: string
              }
              pagePath = lastBreadcrumb?.url || `/${page?.slug}`
            } else {
              pagePath = `/${page?.slug}`
            }

            return locales.map((locale) => ({
              loc: pagePath === '' ? `${SITE_URL}/${locale}` : `${SITE_URL}/${locale}${pagePath}`,
              lastmod: page.updatedAt || dateFallback,
            }))
          })
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
