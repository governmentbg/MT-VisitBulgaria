export interface SendTemplateEmailParams {
  recipientEmail: string
  recipientName?: string
  templateName: string
  language?: string
  subject?: string
  templateData?: Record<string, unknown>
}

export async function sendTemplateEmail(params: SendTemplateEmailParams): Promise<void> {
  const baseUrl = process.env.NOTIFICATION_SERVICE_URL ?? 'http://notification-service'
  const apiKey = process.env.NOTIFICATION_API_KEY

  const body = {
    messageId: crypto.randomUUID(),
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    templateName: params.templateName,
    language: params.language ?? 'en',
    subject: params.subject,
    templateData: params.templateData ?? {},
    createdAt: new Date().toISOString(),
    retryCount: 0,
  }

  try {
    const res = await fetch(`${baseUrl}/api/notifications/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-Api-Key': apiKey }),
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.error(`[notification-client] Failed to queue email: ${res.status} ${res.statusText}`)
    }
  } catch (err) {
    console.error('[notification-client] Failed to reach notification service:', err)
  }
}
