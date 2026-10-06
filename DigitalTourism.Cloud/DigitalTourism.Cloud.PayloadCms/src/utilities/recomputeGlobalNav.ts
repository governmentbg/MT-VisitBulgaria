import type { Payload, SelectType } from 'payload'

import { revalidateTag } from 'next/cache'

import { LOCALE_CODES } from '@/i18n/localization'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('utilities:recompute-global-nav')

type GlobalNavSlug = 'main-menu' | 'footer'

// Note: main-menu intentionally omits `select` — Payload's select with group fields
// (like `link: true`) strips polymorphic relationship sub-fields (`reference`).
// Using only `populate` ensures references are resolved while trimming referenced docs.
const selectShapes: Record<GlobalNavSlug, SelectType | undefined> = {
  'main-menu': undefined,
  footer: {
    linkGroups: {
      title: true,
      links: {
        link: true,
      },
    },
    socialLinks: true,
    newsletterHeadline: true,
    newsletterSubtitle: true,
  },
}

const populateShape = {
  pages: { slug: true, title: true, breadcrumbs: true },
  media: { url: true, alt: true, sizes: { thumbnail: true, small: true } },
} as const

/**
 * Pre-computes the fully-resolved navigation data for a global (main-menu or footer)
 * across all locales and stores it in the `_resolved` JSON field.
 *
 * This shifts expensive JOIN queries from read-time to write-time.
 * Called from afterChange hooks on globals and from cascading recomputation triggers.
 */
export async function recomputeGlobalNav(
  slug: GlobalNavSlug,
  payload: Payload,
): Promise<void> {
  const resolvedMap: Record<string, unknown> = {}

  await Promise.all(
    LOCALE_CODES.map(async (locale) => {
      const selectShape = selectShapes[slug]
      const data = await payload.findGlobal({
        slug,
        depth: 1,
        locale,
        ...(selectShape && { select: selectShape }),
        populate: populateShape,
      })

      // Strip the _resolved field from the fetched data to avoid nesting it inside itself
      const { _resolved: _, ...rest } = data as unknown as Record<string, unknown>
      resolvedMap[locale] = rest
    }),
  )

  await payload.updateGlobal({
    slug,
    data: { _resolved: resolvedMap } as Record<string, unknown>,
    context: { skipResolvedComputation: true, disableRevalidate: true },
  })

  revalidateTag(`global_${slug}`)

  logger.info(`Recomputed _resolved for global "${slug}" across ${LOCALE_CODES.length} locales`)
}

/**
 * Recomputes _resolved for both main-menu and footer globals.
 * Used for cascading invalidation when referenced pages/posts change.
 */
export async function recomputeAllGlobalNav(payload: Payload): Promise<void> {
  await Promise.all([
    recomputeGlobalNav('main-menu', payload),
    recomputeGlobalNav('footer', payload),
  ])
}
