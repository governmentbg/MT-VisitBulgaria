import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import { createLogger } from '@/plugins/logging'
import { recomputeGlobalNav } from '@/utilities/recomputeGlobalNav'

const logger = createLogger('hooks:revalidate-main-menu')

export const revalidateMainMenu: GlobalAfterChangeHook = ({ doc, req: { context, payload } }) => {
  if (context.disableRevalidate || context.skipResolvedComputation) return doc

  logger.info('Revalidating main menu')

  // Revalidate layout cache immediately so stale pages aren't served
  revalidatePath('/', 'layout')

  // Fire-and-forget: recompute _resolved after the transaction commits.
  // Cannot await inside afterChange — findGlobal + updateGlobal on the same
  // global within the same transaction would deadlock.
  setImmediate(() => {
    recomputeGlobalNav('main-menu', payload).catch((error) => {
      logger.error('Failed to recompute main-menu _resolved', { error: String(error) })
    })
  })

  return doc
}
