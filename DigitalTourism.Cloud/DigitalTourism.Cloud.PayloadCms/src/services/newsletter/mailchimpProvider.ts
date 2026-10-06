import type { NewsletterProvider, NewsletterProviderConfig } from './types'

/**
 * Creates an MD5 hash of a string (for Mailchimp subscriber hash).
 * Uses Web Crypto API available in Node 18+.
 */
async function md5(input: string): Promise<string> {
  const { createHash } = await import('crypto')
  return createHash('md5').update(input).digest('hex')
}

export function createMailchimpProvider(config: NewsletterProviderConfig): NewsletterProvider {
  const apiKey = config.mailchimpApiKey
  const audienceId = config.mailchimpAudienceId

  if (!apiKey || !audienceId) {
    throw new Error('Mailchimp provider requires apiKey and audienceId')
  }

  // Extract data center from API key (e.g. "abc123def-us21" → "us21")
  const dc = apiKey.split('-').pop()
  const baseUrl = `https://${dc}.api.mailchimp.com/3.0`

  return {
    async subscribe(email: string, _locale: string, _source: string) {
      const subscriberHash = await md5(email.toLowerCase())

      // Use PUT for upsert — creates or updates the subscriber
      const res = await fetch(
        `${baseUrl}/lists/${audienceId}/members/${subscriberHash}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: email,
            status_if_new: 'subscribed',
          }),
        },
      )

      if (!res.ok) {
        const body = await res.text()
        throw new Error(`Mailchimp API error (${res.status}): ${body}`)
      }
    },
  }
}
