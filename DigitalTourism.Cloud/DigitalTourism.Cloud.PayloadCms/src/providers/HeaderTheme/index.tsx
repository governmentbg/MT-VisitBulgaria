'use client'

import { type NavTheme } from '@/Header/types'

import React, { createContext, useCallback, use, useState } from 'react'

export interface ContextType {
  headerTheme: NavTheme
  setHeaderTheme: (theme: NavTheme) => void
}

const initialContext: ContextType = {
  headerTheme: 'solid',
  setHeaderTheme: () => null,
}

const HeaderThemeContext = createContext(initialContext)

export const HeaderThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [headerTheme, setThemeState] = useState<NavTheme>('solid')

  const setHeaderTheme = useCallback((themeToSet: NavTheme) => {
    setThemeState(themeToSet)
  }, [])

  return <HeaderThemeContext value={{ headerTheme, setHeaderTheme }}>{children}</HeaderThemeContext>
}

export const useHeaderTheme = (): ContextType => use(HeaderThemeContext)
