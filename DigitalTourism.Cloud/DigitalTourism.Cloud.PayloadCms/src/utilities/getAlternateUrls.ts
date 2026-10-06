import { cache } from 'react'
import { getPayloadClient } from '@/payload/payloadClient'
import { LOCALE_CODES, DEFAULT_LOCALE } from '@/i18n/localization'
import type { Config } from '@/payload-types'

type LocaleUrlMap = Record<string, string>

/**
 * Fetches the localized URL for every locale of a given document.
 * Uses `locale: 'all'` to get all locale data in a single query.
 *
 * For pages (with nested-docs breadcrumbs): uses the last breadcrumb URL per locale.
 * For experiences (flat collections): builds `/{collectionPrefix}/{slug}` per locale.
 *
 * Falls back to the English slug/URL when a locale has no slug set.
 */
export const getAlternateUrls = cache(
  async ({
    collection,
    id,
    collectionPrefix,
  }: {
    collection: keyof Config['collections']
    id: number | string
    /** URL prefix for experience collections, e.g. 'attractions', 'hotels' */
    collectionPrefix?: string
  }): Promise<LocaleUrlMap> => {
    const payload = await getPayloadClient()

    const rawDoc = await payload.findByID({
      collection,
      id,
      locale: 'all',
      depth: 0,
      select: {
        slug: true,
        breadcrumbs: true,
      },
    })

    if (!rawDoc) return {}

    // With locale: 'all', localized fields become Record<locale, value> objects.
    // Cast to access them generically since the exact type depends on collection.
    const doc = rawDoc as Record<string, unknown>

    const slugsByLocale = doc.slug as Record<string, string | null> | undefined
    const breadcrumbsByLocale = doc.breadcrumbs as
      | Record<string, Array<{ url?: string | null }>>
      | undefined

    const urls: LocaleUrlMap = {}
    const enSlug = slugsByLocale?.[DEFAULT_LOCALE] || ''

    // Get the English breadcrumb URL once — used as fallback
    const enBreadcrumbUrl = breadcrumbsByLocale?.[DEFAULT_LOCALE]?.at(-1)?.url

    for (const locale of LOCALE_CODES) {
      const localeSlug = slugsByLocale?.[locale]

      // For pages with breadcrumbs — use the last breadcrumb URL,
      // but ONLY if this locale actually has a slug set. Otherwise the
      // breadcrumb URL is malformed (missing the child segment).
      if (breadcrumbsByLocale) {
        if (localeSlug) {
          const localeBreadcrumbs = breadcrumbsByLocale[locale]
          if (localeBreadcrumbs && localeBreadcrumbs.length > 0) {
            const lastUrl = localeBreadcrumbs[localeBreadcrumbs.length - 1]?.url
            if (lastUrl) {
              urls[locale] = lastUrl
              continue
            }
          }
        }
        // No locale slug or broken breadcrumbs — fall back to English URL
        if (enBreadcrumbUrl) {
          urls[locale] = enBreadcrumbUrl
          continue
        }
      }

      // For flat collections (experiences) or pages without breadcrumbs
      const slug = localeSlug || enSlug
      if (slug) {
        if (slug === 'home') {
          urls[locale] = '/'
        } else if (collectionPrefix) {
          urls[locale] = `/${collectionPrefix}/${slug}`
        } else {
          urls[locale] = `/${slug}`
        }
      }
    }

    return urls
  },
)
