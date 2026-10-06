import type { CollectionBeforeValidateHook } from 'payload'
import type { Page } from '@/payload-types'
import { DEFAULT_LOCALE } from '@/i18n/localization'
import { APIError } from 'payload'

/**
 * Prevents publishing a page unless the English (default locale) title and slug exist.
 *
 * English is the fallback locale for all other languages — breadcrumbs, language
 * switching, and URL resolution all depend on the English slug being present.
 * Drafts can be created/saved in any locale freely; only publishing is gated.
 *
 * Uses beforeValidate (not beforeChange) to fail fast before Payload processes
 * the data further. Avoids querying within the transaction to prevent deadlocks
 * with Payload's version creation.
 */
export const requireEnglishBeforePublish: CollectionBeforeValidateHook<Page> = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // Only gate on publish — drafts are unrestricted
  if (data?._status !== 'published') return data

  // If we're already in the English locale, the standard field validators handle it
  if (req.locale === DEFAULT_LOCALE) return data

  // On create from a non-English locale, English fields won't exist yet
  if (operation === 'create') {
    throw new APIError(
      'Pages must have an English title and slug before publishing. Please save the English version first.',
      400,
    )
  }

  // On update: check the existing document's English fields.
  // Use a separate query WITHOUT req to avoid interfering with the publish transaction.
  if (originalDoc) {
    const enDoc = await req.payload.findByID({
      collection: 'pages',
      id: originalDoc.id,
      locale: DEFAULT_LOCALE,
      depth: 0,
      overrideAccess: true,
      select: { title: true, slug: true },
    })

    if (!enDoc?.title || !enDoc?.slug) {
      throw new APIError(
        'Pages must have an English title and slug before publishing. Please save the English version first.',
        400,
      )
    }
  }

  return data
}
