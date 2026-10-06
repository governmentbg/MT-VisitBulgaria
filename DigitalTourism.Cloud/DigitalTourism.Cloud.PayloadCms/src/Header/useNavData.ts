'use client'
import { useState, useCallback, useRef } from 'react'
import type { MainMenu } from '@/payload-types'

type Tabs = MainMenu['tabs']

export function useNavData(locale: string) {
  const [tabs, setTabs] = useState<Tabs | null>(null)
  const fetchedRef = useRef(false)

  const ensureLoaded = useCallback(async () => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    const res = await fetch(`/api/nav/${locale}`)
    const data = await res.json()
    setTabs(data)
  }, [locale])

  return { tabs, ensureLoaded }
}
