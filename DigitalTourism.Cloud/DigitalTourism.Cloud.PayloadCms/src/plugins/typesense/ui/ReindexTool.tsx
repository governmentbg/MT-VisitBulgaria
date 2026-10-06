'use client'

import React, { useCallback, useState } from 'react'
import { Button } from '@payloadcms/ui'

type Status = 'idle' | 'loading' | 'done' | 'error'

interface ReindexResults {
  [collection: string]: { totalDocuments: number; durationMs: number }
}

export const ReindexTool: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle')
  const [results, setResults] = useState<ReindexResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSync = useCallback(async (recreate: boolean) => {
    setStatus('loading')
    setResults(null)
    setError(null)

    try {
      const url = recreate
        ? '/api/typesense-reindex'
        : '/api/typesense-resync?recreate=false'
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        const message = data.errors?.[0]?.message || data.error || 'An unknown error occurred'
        throw new Error(message)
      }

      // Normalize response shape — resync endpoint returns { results: [{ collection, ... }] }
      if (data.results && Array.isArray(data.results)) {
        const normalized: ReindexResults = {}
        for (const r of data.results) {
          normalized[r.collection] = {
            totalDocuments: r.totalDocuments ?? 0,
            durationMs: r.durationMs ?? 0,
          }
        }
        setResults(normalized)
      } else {
        setResults(data.results)
      }

      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setStatus('error')
    }
  }, [])

  return (
    <div>
      <h2>Typesense Search Index</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Manage the Typesense search index. <strong>Reindex</strong> drops and recreates all
        collections with a fresh schema, then re-imports documents. <strong>Resync</strong> keeps
        the existing schema and upserts all documents — faster, and useful when data is out of sync
        but the schema hasn&apos;t changed.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Button
          onClick={() => handleSync(true)}
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
        >
          {status === 'loading' ? 'Working...' : 'Reindex (recreate)'}
        </Button>
        <Button
          onClick={() => handleSync(false)}
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
          buttonStyle="secondary"
        >
          {status === 'loading' ? 'Working...' : 'Resync (upsert only)'}
        </Button>
      </div>

      {status === 'done' && results && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4>Complete</h4>
          <ul>
            {Object.entries(results).map(([collection, stats]) => (
              <li key={collection}>
                <strong>{collection}</strong>: {stats.totalDocuments} document
                {stats.totalDocuments !== 1 ? 's' : ''} indexed in {(stats.durationMs / 1000).toFixed(1)}s
              </li>
            ))}
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

export default ReindexTool
