'use client'

import React, { useState, useCallback } from 'react'

type Props = {
  locale: string
  returnTo: string
}

export function SiteAccessForm({ locale, returnTo }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      setLoading(true)

      try {
        const res = await fetch('/api/site-password/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        })

        if (res.ok) {
          window.location.href = returnTo
        } else {
          const data = await res.json()
          setError(
            locale === 'bg'
              ? 'Грешна парола. Опитайте отново.'
              : data.error || 'Incorrect password. Please try again.',
          )
        }
      } catch {
        setError(
          locale === 'bg'
            ? 'Възникна грешка. Опитайте отново.'
            : 'An error occurred. Please try again.',
        )
      } finally {
        setLoading(false)
      }
    },
    [password, returnTo, locale],
  )

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        autoComplete="current-password"
        placeholder={locale === 'bg' ? 'Парола' : 'Password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '1rem',
          marginBottom: '1rem',
          boxSizing: 'border-box',
        }}
      />
      {error && (
        <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !password}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading || !password ? 0.6 : 1,
        }}
      >
        {loading
          ? (locale === 'bg' ? 'Проверка...' : 'Verifying...')
          : (locale === 'bg' ? 'Влизане' : 'Enter Site')}
      </button>
    </form>
  )
}
