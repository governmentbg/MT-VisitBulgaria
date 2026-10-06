'use client'
import React, { useEffect } from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import type { NavTheme } from '@/Header/types'

const PageClient: React.FC<{ navTheme?: NavTheme }> = ({ navTheme = 'solid' }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme(navTheme)
    document.documentElement.dataset.headerTheme = navTheme
    return () => {
      setHeaderTheme('solid')
      delete document.documentElement.dataset.headerTheme
    }
  }, [navTheme, setHeaderTheme])

  return null
}

export default PageClient
