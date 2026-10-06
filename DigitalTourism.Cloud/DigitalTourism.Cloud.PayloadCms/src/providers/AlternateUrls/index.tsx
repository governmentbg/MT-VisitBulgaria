'use client'

import React, { createContext, useCallback, use, useState } from 'react'

type AlternateUrls = Record<string, string>

export interface AlternateUrlsContextType {
  alternateUrls: AlternateUrls
  setAlternateUrls: (urls: AlternateUrls) => void
}

const initialContext: AlternateUrlsContextType = {
  alternateUrls: {},
  setAlternateUrls: () => null,
}

const AlternateUrlsContext = createContext(initialContext)

export const AlternateUrlsProvider = ({ children }: { children: React.ReactNode }) => {
  const [alternateUrls, setUrlsState] = useState<AlternateUrls>({})

  const setAlternateUrls = useCallback((urls: AlternateUrls) => {
    setUrlsState(urls)
  }, [])

  return (
    <AlternateUrlsContext value={{ alternateUrls, setAlternateUrls }}>
      {children}
    </AlternateUrlsContext>
  )
}

export const useAlternateUrls = (): AlternateUrlsContextType => use(AlternateUrlsContext)
