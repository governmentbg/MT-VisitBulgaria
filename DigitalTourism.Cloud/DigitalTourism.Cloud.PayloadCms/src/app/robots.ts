import type { MetadataRoute } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import type { Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = (await getCachedGlobal('settings', 0)()) as Setting
  const siteUrl = getServerSideURL()

  if (settings.allowCrawlerIndexing) {
    return {
      rules: [
        { userAgent: '*', allow: '/', disallow: '/admin/*' },
      ],
      sitemap: [
        `${siteUrl}/sitemap.xml`,
        `${siteUrl}/pages-sitemap.xml`        
      ],
      host: siteUrl,
    }
  }

  return {
    rules: [
      { userAgent: '*', disallow: '/' },
    ],
  }
}
