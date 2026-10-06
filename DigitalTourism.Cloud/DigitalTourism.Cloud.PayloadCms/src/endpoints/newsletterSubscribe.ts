import type { Endpoint, PayloadRequest } from 'payload'
import { getNewsletterProvider, type NewsletterProviderConfig } from '@/services/newsletter'
import { LOCALE_CODES, type LocaleCode } from '@/i18n/localization'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function forwardToProvider(req: PayloadRequest, email: string, locale: string, source: string) {
  try {
    const settings = await req.payload.findGlobal({ slug: 'settings', overrideAccess: true })
    const config: NewsletterProviderConfig = {
      provider: (settings.newsletterProvider as NewsletterProviderConfig['provider']) || 'database',
      mailchimpApiKey: settings.mailchimpApiKey,
      mailchimpAudienceId: settings.mailchimpAudienceId,
      brevoApiKey: settings.brevoApiKey,
      brevoListId: settings.brevoListId,
      mailerliteApiToken: settings.mailerliteApiToken,
      mailerliteGroupId: settings.mailerliteGroupId,
    }
    const provider = getNewsletterProvider(config)
    await provider.subscribe(email, locale, source)
  } catch (providerError) {
    // Log but don't fail the user-facing request — DB record is already saved
    console.error('Newsletter provider error:', providerError)
  }
}

export const newsletterSubscribeEndpoint: Endpoint = {
  path: '/newsletter/subscribe',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    try {
      const body = typeof req.data === 'object' && req.data ? req.data : await req.json?.()
      const email = (body?.email as string)?.trim().toLowerCase()
      const rawLocale = (body?.locale as string) || 'en'
      const locale: LocaleCode = LOCALE_CODES.includes(rawLocale as LocaleCode)
        ? (rawLocale as LocaleCode)
        : 'en'
      const source = (body?.source as string) || 'footer'

      if (!email || !EMAIL_REGEX.test(email)) {
        return Response.json(
          { success: false, error: 'Invalid email address' },
          { status: 400 },
        )
      }

      // Check if already exists in local DB
      const existing = await req.payload.find({
        collection: 'newsletter-subscriptions',
        where: { email: { equals: email } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        const doc = existing.docs[0]
        // Re-subscribe if previously unsubscribed
        if (doc.status === 'unsubscribed') {
          await req.payload.update({
            collection: 'newsletter-subscriptions',
            id: doc.id,
            data: { status: 'active' },
          })
        }
        // Always forward to external provider (it handles duplicates via upsert)
        await forwardToProvider(req, email, locale, source)
        return Response.json({ success: true })
      }

      // Create new subscription in local DB
      try {
        await req.payload.create({
          collection: 'newsletter-subscriptions',
          data: { email, status: 'active', locale, source },
        })
      } catch (createError: any) {
        // Handle race condition: unique constraint violation → already exists
        if (createError?.message?.includes('unique') || createError?.code === '23505') {
          await forwardToProvider(req, email, locale, source)
          return Response.json({ success: true })
        }
        throw createError
      }

      // Forward to external provider
      await forwardToProvider(req, email, locale, source)

      return Response.json({ success: true })
    } catch (error) {
      console.error('Newsletter subscribe error:', error)
      return Response.json(
        { success: false, error: 'An error occurred. Please try again.' },
        { status: 500 },
      )
    }
  },
}
