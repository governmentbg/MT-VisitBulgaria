import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { revalidatePathForAllLocales } from '@/utilities/revalidatePathForAllLocales'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('hooks:revalidate-settings')

export const revalidateSettings: GlobalAfterChangeHook = ({ doc, previousDoc, req: { context } }) => {
  if (!context.disableRevalidate) {
    logger.info(`Revalidating settings`)

    revalidateTag('global_settings')

    if (doc.homePage !== previousDoc?.homePage) {
      logger.info(`Home page changed, revalidating root route`)
      revalidatePathForAllLocales('/')
    }
  }

  return doc
}
