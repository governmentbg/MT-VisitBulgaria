import type { NewsletterProvider } from './types'

/**
 * Default provider — data is already stored in the Payload collection
 * by the subscribe endpoint. This is a no-op pass-through.
 */
export const databaseProvider: NewsletterProvider = {
  async subscribe() {
    // No-op: the endpoint writes to the collection directly
  },
}
