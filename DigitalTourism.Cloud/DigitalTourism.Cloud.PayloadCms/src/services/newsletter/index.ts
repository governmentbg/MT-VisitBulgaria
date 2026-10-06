import type { NewsletterProvider, NewsletterProviderConfig } from './types'
import { databaseProvider } from './databaseProvider'
import { createMailchimpProvider } from './mailchimpProvider'
import { createBrevoProvider } from './brevoProvider'
import { createMailerliteProvider } from './mailerliteProvider'

export type { NewsletterProvider, NewsletterProviderConfig }

/**
 * Returns the configured newsletter provider based on Settings global config.
 * Default: database-only (no external calls).
 */
export function getNewsletterProvider(config: NewsletterProviderConfig): NewsletterProvider {
  switch (config.provider) {
    case 'mailchimp':
      return createMailchimpProvider(config)
    case 'brevo':
      return createBrevoProvider(config)
    case 'mailerlite':
      return createMailerliteProvider(config)
    case 'database':
    default:
      return databaseProvider
  }
}
