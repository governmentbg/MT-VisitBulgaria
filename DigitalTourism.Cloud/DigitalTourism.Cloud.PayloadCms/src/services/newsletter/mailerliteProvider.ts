import type { NewsletterProvider, NewsletterProviderConfig } from './types'

export function createMailerliteProvider(config: NewsletterProviderConfig): NewsletterProvider {
  const apiToken = config.mailerliteApiToken

  if (!apiToken) {
    throw new Error('MailerLite provider requires apiToken')
  }

  return {
    async subscribe(email: string, _locale: string, _source: string) {
      const body: Record<string, unknown> = { email }

      if (config.mailerliteGroupId) {
        body.groups = [config.mailerliteGroupId]
      }

      const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const responseBody = await res.text()
        throw new Error(`MailerLite API error (${res.status}): ${responseBody}`)
      }
    },
  }
}
