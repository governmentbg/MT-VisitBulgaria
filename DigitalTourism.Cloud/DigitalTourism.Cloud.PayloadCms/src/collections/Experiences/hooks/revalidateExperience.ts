import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { createLogger } from '@/plugins/logging'
import { revalidatePathForAllLocales } from '@/utilities/revalidatePathForAllLocales'

import type { ExperienceSlug } from '../constants'
import { SLUG_TO_PATH } from '../constants'

const logger = createLogger('hooks:revalidate-experience')

/**
 * Creates an afterChange revalidation hook for a specific experience collection.
 * The path is derived from the collection slug, no longer from doc.type.
 */
export function createRevalidateExperienceHook(
  collectionSlug: ExperienceSlug,
): CollectionAfterChangeHook {
  const pathSegment = SLUG_TO_PATH[collectionSlug]

  return ({ doc, previousDoc, req: { context } }) => {
    if (!context.disableRevalidate) {
      if (doc._status === 'published') {
        const path = `/${pathSegment}/${doc.slug}`

        logger.info(`Revalidating ${collectionSlug} at path: ${path} for all locales`)

        revalidatePathForAllLocales(path)

        // Revalidate the list page
        revalidatePathForAllLocales(`/${pathSegment}`)

        // Revalidate sitemap tags
        revalidateTag('experiences-sitemap')
        revalidateTag(`${pathSegment}-sitemap`)
      }

      // If the experience was previously published, revalidate the old path
      if (previousDoc?._status === 'published' && doc._status !== 'published') {
        const oldPath = `/${pathSegment}/${previousDoc.slug}`

        logger.info(`Revalidating old ${collectionSlug} at path: ${oldPath} for all locales`)

        revalidatePathForAllLocales(oldPath)
        revalidatePathForAllLocales(`/${pathSegment}`)

        revalidateTag('experiences-sitemap')
        revalidateTag(`${pathSegment}-sitemap`)
      }
    }
    return doc
  }
}

/**
 * Creates an afterDelete revalidation hook for a specific experience collection.
 */
export function createRevalidateExperienceDeleteHook(
  collectionSlug: ExperienceSlug,
): CollectionAfterDeleteHook {
  const pathSegment = SLUG_TO_PATH[collectionSlug]

  return ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) {
      const path = `/${pathSegment}/${doc?.slug}`

      revalidatePathForAllLocales(path)
      revalidatePathForAllLocales(`/${pathSegment}`)

      revalidateTag('experiences-sitemap')
      revalidateTag(`${pathSegment}-sitemap`)
    }

    return doc
  }
}
