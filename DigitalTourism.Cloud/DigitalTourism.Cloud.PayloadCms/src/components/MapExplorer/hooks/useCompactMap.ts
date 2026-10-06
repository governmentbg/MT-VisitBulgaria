'use client'

import { useEffect, useState } from 'react'

/**
 * Matches phones and touch tablets — the devices where an embedded, interactive
 * map traps the page scroll.
 *
 * The width clause mirrors the `md` breakpoint already used to switch between
 * the desktop and mobile explorers in MapExplorer.tsx; the pointer clause also
 * catches touch tablets that are wider than that.
 */
const COMPACT_QUERY = '(max-width: 767px), (pointer: coarse)'

/**
 * Returns true when embedded maps should render as a static preview.
 *
 * Deliberately returns `false` on the server and for the first client render,
 * then updates in an effect — reading `matchMedia` during render would produce
 * server/client markup that disagrees and trigger a hydration mismatch.
 */
export function useCompactMap(): boolean {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mql = window.matchMedia(COMPACT_QUERY)
    const update = () => setIsCompact(mql.matches)

    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  return isCompact
}
