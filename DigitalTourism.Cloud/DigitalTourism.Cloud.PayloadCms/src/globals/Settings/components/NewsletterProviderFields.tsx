'use client'

import React, { useEffect, useState } from 'react'
import { useWatchForm } from '@payloadcms/ui'

/**
 * Wraps newsletter provider-specific fields with a loading indicator
 * when the provider selection changes. The conditional fields take a moment
 * to render/unmount, so we show a spinner during the transition.
 */
export const NewsletterProviderFields: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { getDataByPath } = useWatchForm()
  const provider = getDataByPath('newsletterProvider') as string | undefined
  const [displayedProvider, setDisplayedProvider] = useState(provider)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (provider !== displayedProvider) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setDisplayedProvider(provider)
        setIsTransitioning(false)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [provider, displayedProvider])

  if (provider === 'database' || !provider) {
    return (
      <div style={{ padding: '12px 0', fontSize: '14px', color: 'var(--theme-elevation-500)' }}>
        Subscriptions are stored in the local database only. No external provider is configured.
      </div>
    )
  }

  if (isTransitioning) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 0', color: 'var(--theme-elevation-500)' }}>
        <span
          style={{
            width: 20,
            height: 20,
            border: '2.5px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'newsletter-provider-spin 0.6s linear infinite',
          }}
        />
        <span style={{ fontSize: '14px' }}>Loading provider configuration...</span>
        <style>{`@keyframes newsletter-provider-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return <>{children}</>
}
