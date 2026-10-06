'use client'

import React, { useCallback, useState } from 'react'
import { Button } from '@payloadcms/ui'

type Status = 'idle' | 'loading' | 'done' | 'error'

export const RedisCachePurgeTool: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle')
  const [keysRemoved, setKeysRemoved] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePurge = useCallback(async () => {
    setStatus('loading')
    setKeysRemoved(null)
    setError(null)

    try {
      const response = await fetch('/api/purge-redis-cache', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        const message = data.errors?.[0]?.message || 'An unknown error occurred'
        throw new Error(message)
      }

      setKeysRemoved(data.keysRemoved)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setStatus('error')
    }
  }, [])

  return (
    <div>
      <h2>Purge Redis Cache</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Remove all Next.js cache entries (prefixed with <code>nextjs:</code>) from Redis. This forces
        all pages and data to be re-rendered on the next request. Use this when cached content is
        stale or after a deployment issue.
      </p>

      <Button
        onClick={handlePurge}
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? 'Purging...' : 'Purge Redis Cache'}
      </Button>

      {status === 'done' && keysRemoved !== null && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4>Cache purged successfully</h4>
          <ul>
            <li>
              <strong>Keys removed:</strong> {keysRemoved}
            </li>
          </ul>
        </div>
      )}

      {status === 'error' && error && (
        <div style={{ marginTop: '1.5rem', color: 'var(--theme-error-500)' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}

export default RedisCachePurgeTool
