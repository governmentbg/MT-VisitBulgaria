import type { Endpoint, PayloadRequest } from 'payload'
import { isCuratorOrAdmin } from '@/access/accessHelpers'

import type { ListOption } from '@/services/newsletter/types'

async function fetchMailchimpAudiences(apiKey: string): Promise<ListOption[]> {
  const dc = apiKey.split('-').pop()
  const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists?count=100&fields=lists.id,lists.name,lists.stats.member_count`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Mailchimp API error (${res.status}): ${body}`)
  }
  const data = await res.json()
  return (data.lists || []).map((list: any) => ({
    label: `${list.name} (${list.stats?.member_count ?? 0} subscribers)`,
    value: list.id,
  }))
}

async function fetchBrevoLists(apiKey: string): Promise<ListOption[]> {
  const res = await fetch('https://api.brevo.com/v3/contacts/lists?limit=50&offset=0', {
    headers: {
      'api-key': apiKey,
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Brevo API error (${res.status}): ${body}`)
  }
  const data = await res.json()
  return (data.lists || []).map((list: any) => ({
    label: `${list.name} (${list.uniqueSubscribers ?? 0} subscribers)`,
    value: String(list.id),
  }))
}

async function fetchMailerliteGroups(apiToken: string): Promise<ListOption[]> {
  const res = await fetch('https://connect.mailerlite.com/api/groups?limit=100', {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`MailerLite API error (${res.status}): ${body}`)
  }
  const data = await res.json()
  return (data.data || []).map((group: any) => ({
    label: `${group.name} (${group.active_count ?? 0} subscribers)`,
    value: group.id,
  }))
}

export const newsletterProviderListsEndpoint: Endpoint = {
  path: '/newsletter/provider-lists',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!isCuratorOrAdmin(req.user)) {
      return Response.json(
        { errors: [{ message: 'Unauthorized' }] },
        { status: 403 },
      )
    }

    const body = typeof req.data === 'object' && req.data ? req.data : await req.json?.()
    const provider = body?.provider as string
    const apiKey = body?.apiKey as string

    if (!provider || !apiKey) {
      return Response.json(
        { success: false, error: 'Missing provider or apiKey parameter' },
        { status: 400 },
      )
    }

    try {
      let options: ListOption[] = []

      switch (provider) {
        case 'mailchimp':
          options = await fetchMailchimpAudiences(apiKey)
          break
        case 'brevo':
          options = await fetchBrevoLists(apiKey)
          break
        case 'mailerlite':
          options = await fetchMailerliteGroups(apiKey)
          break
        default:
          return Response.json(
            { success: false, error: `Unknown provider: ${provider}` },
            { status: 400 },
          )
      }

      return Response.json({ success: true, options })
    } catch (error: any) {
      console.error(`Error fetching ${provider} lists:`, error)
      return Response.json(
        { success: false, error: error.message || 'Failed to fetch lists from provider' },
        { status: 502 },
      )
    }
  },
}
