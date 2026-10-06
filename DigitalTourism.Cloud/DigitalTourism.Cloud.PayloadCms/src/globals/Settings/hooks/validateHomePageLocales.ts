import type { GlobalBeforeChangeHook } from 'payload'

import { ValidationError } from 'payload'
import { LOCALE_CODES } from '@/i18n/localization'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('hooks:validate-home-page-locales')

export const validateHomePageLocales: GlobalBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const newHomePageId = data.homePage
  const previousHomePageId = originalDoc?.homePage

  // Skip validation if homePage is unchanged or null
  if (!newHomePageId || newHomePageId === previousHomePageId) {
    return data
  }

  const page = await req.payload.findByID({
    collection: 'pages',
    id: newHomePageId,
    locale: 'all',
    depth: 0,
  })

  const title = page.title as unknown as Record<string, string | null | undefined>
  const missingLocales = LOCALE_CODES.filter((locale) => !title?.[locale])

  if (missingLocales.length > 0) {
    logger.warn(
      `Home page (ID: ${newHomePageId}) is missing titles for locales: ${missingLocales.join(', ')}`,
    )

    throw new ValidationError({
      errors: [
        {
          message: `The selected home page is missing a title for the following locales: ${missingLocales.join(', ')}`,
          path: 'homePage',
        },
      ],
    })
  }

  return data
}
