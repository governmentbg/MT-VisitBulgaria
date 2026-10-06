import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('api:visitors')

const VISITOR_COOKIE_NAME = 'payload-visitor-token'

async function getVisitorFromToken(payload: Awaited<ReturnType<typeof getPayload>>) {
  const cookieStore = await cookies()
  const token = cookieStore.get(VISITOR_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const secretKey = new TextEncoder().encode(payload.secret)
  const { payload: claims } = await jwtVerify(token, secretKey)

  if (!claims.id || claims.collection !== 'visitors') {
    return null
  }

  return await payload.findByID({
    collection: 'visitors',
    id: claims.id as number,
  })
}

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  try {
    const visitor = await getVisitorFromToken(payload)

    if (!visitor) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user: visitor }, { status: 200 })
  } catch (error) {
    logger.error('Error', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ user: null }, { status: 200 })
  }
}

export async function PATCH(request: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  try {
    const visitor = await getVisitorFromToken(payload)

    if (!visitor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Only allow updating specific fields
    const allowedFields = ['language', 'preferences']
    const updateData: Record<string, unknown> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const updated = await payload.update({
      collection: 'visitors',
      id: visitor.id,
      data: updateData,
    })

    return NextResponse.json({ user: updated }, { status: 200 })
  } catch (error) {
    logger.error('Update error', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
