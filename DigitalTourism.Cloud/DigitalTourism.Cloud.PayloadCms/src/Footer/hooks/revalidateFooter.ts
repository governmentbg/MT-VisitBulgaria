import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

import { createLogger } from '@/plugins/logging'
import { recomputeGlobalNav } from '@/utilities/recomputeGlobalNav'

const logger = createLogger('hooks:revalidate-footer')

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { context, payload } }) => {
  if (context.disableRevalidate || context.skipResolvedComputation) return doc

  logger.info('Revalidating footer')

  // Revalidate cache tag immediately so stale data isn't served
  revalidateTag('global_footer')

  // Fire-and-forget: recompute _resolved after the transaction commits.
  setImmediate(() => {
    recomputeGlobalNav('footer', payload).catch((error) => {
      logger.error('Failed to recompute footer _resolved', { error: String(error) })
    })
  })

  return doc
}
