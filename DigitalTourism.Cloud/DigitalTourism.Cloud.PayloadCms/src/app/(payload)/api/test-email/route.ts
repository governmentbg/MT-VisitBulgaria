import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { sendTemplateEmail } from '@/lib/notification-client'

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return Response.json({ success: false, error: 'Missing email' }, { status: 400 })
    }

    await sendTemplateEmail({
      recipientEmail: email,
      templateName: 'welcome',
      language: 'en',
      templateData: { recipient_name: email },
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
