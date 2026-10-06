'use client'

import { useEffect } from 'react'
import { useAlternateUrls } from '@/providers/AlternateUrls'

/**
 * Client component that pushes server-computed alternate locale URLs
 * into the AlternateUrls context, so the LanguageSwitcher can read them.
 *
 * Same pattern as PageClient setting the header theme.
 */
export const AlternateUrlsClient: React.FC<{ urls: Record<string, string> }> = ({ urls }) => {
  const { setAlternateUrls } = useAlternateUrls()

  useEffect(() => {
    setAlternateUrls(urls)
    return () => {
      setAlternateUrls({})
    }
  }, [urls, setAlternateUrls])

  return null
}
