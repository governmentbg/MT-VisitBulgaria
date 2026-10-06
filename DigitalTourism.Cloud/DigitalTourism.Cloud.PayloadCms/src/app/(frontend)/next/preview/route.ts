import type { CollectionSlug, PayloadRequest } from 'payload'
import { getPayloadClient } from '@/payload/payloadClient'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { createLogger } from '@/plugins/logging'


const logger = createLogger('api:preview')

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayloadClient()

  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug
  const slug = searchParams.get('slug')
  const locale = searchParams.get('locale') || 'en'
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path || !collection || !slug) {
    return new Response('Insufficient search params', { status: 404 })
  }

  if (!path.startsWith('/')) {
    return new Response('This endpoint can only be used for relative previews', { status: 500 })
  }

  let user

  try {
    user = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })
  } catch (error) {
    logger.error('Error verifying token for live preview', { error: error instanceof Error ? error.message : String(error) })
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  // You can add additional checks here to see if the user is allowed to preview this page

  draft.enable()

  redirect(`/${locale}${path}`)
}
