'use client'

import React, { useCallback, useState } from 'react'
import { Button } from '@payloadcms/ui'

type Status = 'idle' | 'loading' | 'done' | 'error'

interface RegenerateResults {
  total: number
  processed: number
  failed: number
  durationMs: number
}

export const MediaMigrationTool: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle')
  const [results, setResults] = useState<RegenerateResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRegenerate = useCallback(async () => {
    setStatus('loading')
    setResults(null)
    setError(null)

    try {
      const response = await fetch('/api/regenerate-media-sizes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        const message = data.errors?.[0]?.message || 'An unknown error occurred'
        throw new Error(message)
      }

      setResults(data.results)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setStatus('error')
    }
  }, [])

  return (
    <div>
      <h2>Media AVIF Migration</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Regenerate all image sizes using AVIF format. This re-processes every uploaded image
        with the current format configuration (AVIF for all sizes, WebP for OG).
        AVIF encoding is CPU-intensive — images are processed in batches of 5.
      </p>

      <Button
        onClick={handleRegenerate}
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? 'Regenerating...' : 'Regenerate All Image Sizes (AVIF)'}
      </Button>

      {status === 'done' && results && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4>Regeneration complete</h4>
          <ul>
            <li><strong>Total images:</strong> {results.total}</li>
            <li><strong>Processed:</strong> {results.processed}</li>
            {results.failed > 0 && (
              <li style={{ color: 'var(--theme-error-500)' }}>
                <strong>Failed:</strong> {results.failed}
              </li>
            )}
            <li><strong>Duration:</strong> {(results.durationMs / 1000).toFixed(1)}s</li>
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

export default MediaMigrationTool
