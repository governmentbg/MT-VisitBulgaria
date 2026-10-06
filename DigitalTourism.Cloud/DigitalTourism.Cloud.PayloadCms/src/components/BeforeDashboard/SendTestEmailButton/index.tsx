'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

export const SendTestEmailButton: React.FC = () => {
  const [email, setEmail] = useState('')

  const handleSend = useCallback(async () => {
    const trimmed = email.trim()
    if (!trimmed) {
      toast.error('Please enter an email address.')
      return
    }

    toast.promise(
      fetch('/api/test-email', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      }).then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error ?? `Request failed (${res.status})`)
        }
      }),
      {
        loading: 'Sending test email...',
        success: 'Test email sent!',
        error: (err) => `Failed: ${err instanceof Error ? err.message : String(err)}`,
      },
    )
  }, [email])

  return (
    <Fragment>
      <input
        type="email"
        placeholder="recipient@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: 8, padding: '4px 8px' }}
      />
      <button className="seedButton" onClick={handleSend}>
        Send Test Email
      </button>
    </Fragment>
  )
}
