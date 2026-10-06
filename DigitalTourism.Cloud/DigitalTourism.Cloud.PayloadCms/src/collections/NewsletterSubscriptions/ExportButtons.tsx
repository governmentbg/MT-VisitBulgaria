'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type ExportFormat = 'csv' | 'xlsx'

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const SpinnerIcon = () => (
  <span
    style={{
      width: 14,
      height: 14,
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'export-spin 0.6s linear infinite',
    }}
  />
)

export const ExportButtons: React.FC = () => {
  const [loading, setLoading] = useState<ExportFormat | null>(null)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    // Find the search-bar actions container in the list controls
    const findTarget = () => {
      const searchBar = document.querySelector('.list-controls .search-bar__actions')
      if (searchBar) {
        setPortalTarget(searchBar as HTMLElement)
      } else {
        // Retry if DOM not ready
        requestAnimationFrame(findTarget)
      }
    }
    findTarget()
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleExport = async (format: ExportFormat) => {
    setLoading(format)
    try {
      const res = await fetch(`/api/newsletter/export?format=${format}`)
      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `newsletter-subscriptions.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
    } finally {
      if (mountedRef.current) setLoading(null)
    }
  }

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    border: '1px solid var(--theme-elevation-250)',
    borderRadius: '3px',
    background: 'transparent',
    color: 'var(--theme-elevation-800)',
    fontSize: '13px',
    cursor: loading ? 'wait' : 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background 0.15s',
  }

  const buttons = (
    <>
      <style>{`@keyframes export-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        type="button"
        onClick={() => handleExport('csv')}
        disabled={loading !== null}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--theme-elevation-100)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        {loading === 'csv' ? <SpinnerIcon /> : <DownloadIcon />}
        CSV
      </button>
      <button
        type="button"
        onClick={() => handleExport('xlsx')}
        disabled={loading !== null}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--theme-elevation-100)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        {loading === 'xlsx' ? <SpinnerIcon /> : <DownloadIcon />}
        XLSX
      </button>
    </>
  )

  if (portalTarget) {
    return createPortal(buttons, portalTarget)
  }

  // Fallback: render nothing while waiting for portal target
  return null
}
