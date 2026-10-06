import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('hooks:revalidate-redirects')

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, context }) => {
  if (!context.disableRevalidate) {
    logger.info(`Revalidating redirects`)
    revalidateTag('redirects')
  }

  return doc
}
