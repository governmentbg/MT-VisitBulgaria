import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { createLogger } from '@/plugins/logging'
import { revalidatePathForAllLocales } from '@/utilities/revalidatePathForAllLocales'
import { recomputeAllGlobalNav } from '@/utilities/recomputeGlobalNav'

import type { Page } from '../../../payload-types'

const logger = createLogger('hooks:revalidate-page')

// Helper to get the full URL path from breadcrumbs
const getPagePath = (doc: Page): string => {
  if (doc.slug === 'home') return '/'

  // Use breadcrumbs URL if available (set by nested-docs plugin)
  if (doc.breadcrumbs && Array.isArray(doc.breadcrumbs) && doc.breadcrumbs.length > 0) {
    const lastBreadcrumb = doc.breadcrumbs[doc.breadcrumbs.length - 1]
    if (lastBreadcrumb?.url) {
      return lastBreadcrumb.url
    }
  }

  // Fallback to simple slug
  return `/${doc.slug}`
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = getPagePath(doc)

      logger.info(`Revalidating page at path: ${path} for all locales`)

      revalidatePathForAllLocales(path)
      revalidateTag('pages-sitemap')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = getPagePath(previousDoc)

      logger.info(`Revalidating old page at path: ${oldPath} for all locales`)

      revalidatePathForAllLocales(oldPath)
      revalidateTag('pages-sitemap')
    }

    // Recompute global nav when a page's slug or breadcrumbs change,
    // since the main menu or footer may link to this page.
    const slugChanged = doc.slug !== previousDoc?.slug
    const breadcrumbsChanged =
      JSON.stringify(doc.breadcrumbs) !== JSON.stringify(previousDoc?.breadcrumbs)

    if (slugChanged || breadcrumbsChanged) {
      logger.info(`Page slug/breadcrumbs changed — recomputing global nav`)

      void (async () => {
        try {
          await recomputeAllGlobalNav(payload)
        } catch (error) {
          logger.error('Failed to recompute global nav after page change', { error })
        }
      })()
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc) {
    const path = getPagePath(doc)
    revalidatePathForAllLocales(path)
    revalidateTag('pages-sitemap')
  }

  return doc
}
