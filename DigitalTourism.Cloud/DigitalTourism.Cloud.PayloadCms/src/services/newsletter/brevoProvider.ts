import type { NewsletterProvider, NewsletterProviderConfig } from './types'

export function createBrevoProvider(config: NewsletterProviderConfig): NewsletterProvider {
  const apiKey = config.brevoApiKey

  if (!apiKey) {
    throw new Error('Brevo provider requires apiKey')
  }

  return {
    async subscribe(email: string, _locale: string, _source: string) {
      const body: Record<string, unknown> = {
        email,
        updateEnabled: true,
      }

      if (config.brevoListId) {
        body.listIds = [Number(config.brevoListId)]
      }

      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      // 201 = created, 204 = already exists (with updateEnabled)
      if (!res.ok && res.status !== 204) {
        const responseBody = await res.text()
        throw new Error(`Brevo API error (${res.status}): ${responseBody}`)
      }
    },
  }
}
