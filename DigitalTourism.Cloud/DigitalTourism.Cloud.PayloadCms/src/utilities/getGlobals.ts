import type { Config } from 'src/payload-types'
import type { Footer, MainMenu } from '@/payload-types'
import type { PayloadLocale } from '@/i18n/localization'
import type { SelectType } from 'payload'

import { cache } from 'react'
import { getPayloadClient } from '@/payload/payloadClient'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0, locale?: PayloadLocale) {
  try {
    const payload = await getPayloadClient()

    const global = await payload.findGlobal({
      slug,
      depth,
      locale,
    })

    return global
  } catch {
    // During HMR the cached Payload client can go stale — retry once
    const { resetPayloadClient } = await import('@/payload/payloadClient')
    resetPayloadClient()
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug, depth, locale })
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug and locale.
 * Used for globals that don't have a dedicated optimized reader (e.g. settings).
 */
export const getCachedGlobal = (slug: Global, depth = 0, locale?: PayloadLocale) =>
  unstable_cache(async () => getGlobal(slug, depth, locale), [slug, String(depth), locale ?? 'default'], {
    tags: [`global_${slug}`],
  })

// select shape that only fetches the _resolved JSON column
const resolvedOnly = { _resolved: true } as SelectType

type GlobalWithResolved = { _resolved?: Record<string, unknown> }

/**
 * Reads the pre-computed _resolved JSON for the main menu.
 * Falls back to a live depth:1 query if _resolved hasn't been computed yet.
 */
export const getCachedMainMenu = (locale: PayloadLocale) =>
  unstable_cache(
    cache(async (): Promise<MainMenu> => {
      const payload = await getPayloadClient()
      const global = (await payload.findGlobal({
        slug: 'main-menu',
        depth: 0,
        select: resolvedOnly,
      })) as unknown as GlobalWithResolved

      const resolved = global._resolved?.[locale]
      if (resolved) return resolved as MainMenu

      // Fallback: live query (slow path, only before first admin save populates _resolved)
      return (await payload.findGlobal({ slug: 'main-menu', depth: 1, locale })) as MainMenu
    }),
    ['main-menu', locale],
    { tags: ['global_main-menu'] },
  )

/**
 * Reads the pre-computed _resolved JSON for the footer.
 * Falls back to a live depth:1 query if _resolved hasn't been computed yet.
 */
export const getCachedFooter = (locale: PayloadLocale) =>
  unstable_cache(
    cache(async (): Promise<Footer> => {
      const payload = await getPayloadClient()
      const global = (await payload.findGlobal({
        slug: 'footer',
        depth: 0,
        select: resolvedOnly,
      })) as unknown as GlobalWithResolved

      const resolved = global._resolved?.[locale]
      if (resolved) return resolved as Footer

      // Fallback: live query (slow path, only before first admin save populates _resolved)
      return (await payload.findGlobal({ slug: 'footer', depth: 1, locale })) as Footer
    }),
    ['footer', locale],
    { tags: ['global_footer'] },
  )
