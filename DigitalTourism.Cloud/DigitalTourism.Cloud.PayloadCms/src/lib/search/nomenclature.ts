'use server'

import { getPayloadClient } from '@/payload/payloadClient'
import type { PayloadLocale } from '@/i18n/localization'

export interface NomenclatureDisplayData {
  icon?: string
  label: string
}

/**
 * Fetches a mapping of nomenclature value slugs to their display data
 * (localized name + icon name). Used for filter labels, badges, and pills.
 */
export async function getNomenclatureDisplayMap(
  locale: PayloadLocale | string,
): Promise<Record<string, NomenclatureDisplayData>> {
  const payload = await getPayloadClient()
  const collections = ['amenities', 'cuisine-types', 'dietary-options', 'seasons', 'difficulty-levels'] as const
  const map: Record<string, NomenclatureDisplayData> = {}

  for (const slug of collections) {
    const result = await payload.find({ collection: slug, limit: 100, depth: 0, locale: locale as PayloadLocale })
    for (const doc of result.docs) {
      if (doc.value) {
        map[doc.value] = {
          label: doc.name || doc.value,
          icon: doc.iconName || undefined,
        }
      }
    }
  }

  return map
}
