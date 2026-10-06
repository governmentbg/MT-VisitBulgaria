import crypto from 'node:crypto'
import type { Endpoint, PayloadRequest } from 'payload'
import { verifySitePassword } from '@/globals/Settings/hooks/hashSitePassword'

function generateAccessToken(storedHash: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(storedHash).digest('hex')
}

export const verifySitePasswordEndpoint: Endpoint = {
  path: '/site-password/verify',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    try {
      const body = typeof req.data === 'object' && req.data ? req.data : await req.json?.()
      const password = body?.password as string

      if (!password || typeof password !== 'string') {
        return Response.json({ success: false, error: 'Password is required' }, { status: 400 })
      }

      const settings = await req.payload.findGlobal({
        slug: 'settings',
        overrideAccess: true,
        depth: 0,
      })

      if (!settings.sitePasswordEnabled || !settings.sitePasswordHash) {
        return Response.json({ success: true })
      }

      const isValid = verifySitePassword(password, settings.sitePasswordHash as string)

      if (!isValid) {
        return Response.json({ success: false, error: 'Incorrect password' }, { status: 401 })
      }

      const secret = process.env.PAYLOAD_SECRET || 'fallback-secret'
      const token = generateAccessToken(settings.sitePasswordHash as string, secret)

      const maxAge = 60 * 60 * 24 * 30 // 30 days
      const isSecure = req.headers?.get('x-forwarded-proto') === 'https' || process.env.NODE_ENV === 'production'

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `site-access-token=${token}; Path=/; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Lax; Max-Age=${maxAge}`,
        },
      })
    } catch (error) {
      console.error('Site password verification error:', error)
      return Response.json(
        { success: false, error: 'An error occurred. Please try again.' },
        { status: 500 },
      )
    }
  },
}
