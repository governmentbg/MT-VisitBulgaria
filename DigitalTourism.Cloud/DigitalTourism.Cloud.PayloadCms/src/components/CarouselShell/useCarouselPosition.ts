import { useEffect, useRef } from 'react'
import type { EmblaCarouselType } from 'embla-carousel'

const PREFIX = 'carousel-pos-f-'
const POPSTATE_EVENT_KEY = `${PREFIX}popstate-event`
const POPSTATE_EVENT_MAX_AGE_MS = 2500

let popstateTrackerInitialized = false

function initPopstateTracker() {
  if (popstateTrackerInitialized) return
  popstateTrackerInitialized = true

  try {
    window.addEventListener('popstate', () => {
      try {
        const token = readPopstateToken() + 1
        sessionStorage.setItem(POPSTATE_EVENT_KEY, `${token}:${Date.now()}`)
      } catch {}
    })
  } catch {}
}

function readPopstateToken(): number {
  try {
    const raw = sessionStorage.getItem(POPSTATE_EVENT_KEY)
    if (!raw) return 0

    const [tokenStr] = raw.split(':')
    const token = parseInt(tokenStr, 10)
    return Number.isNaN(token) ? 0 : token
  } catch {
    return 0
  }
}

function readRecentPopstateToken(): number | null {
  try {
    const raw = sessionStorage.getItem(POPSTATE_EVENT_KEY)
    if (!raw) return null

    const [tokenStr, tsStr] = raw.split(':')
    const token = parseInt(tokenStr, 10)
    const timestamp = parseInt(tsStr, 10)
    if (Number.isNaN(token) || Number.isNaN(timestamp)) return null

    if (Date.now() - timestamp > POPSTATE_EVENT_MAX_AGE_MS) return null
    return token
  } catch {
    return null
  }
}

function isBackForwardNavigation(): boolean {
  try {
    const navEntries = performance.getEntriesByType('navigation')
    const nav = navEntries[0] as PerformanceNavigationTiming | undefined
    return nav?.type === 'back_forward'
  } catch {
    return false
  }
}

export function useCarouselPosition(
  key: string | undefined,
  emblaApi: EmblaCarouselType | undefined,
) {
  const restoredRef = useRef(false)
  const lastHandledPopstateTokenRef = useRef(0)

  useEffect(() => {
    if (!emblaApi || !key) return

    initPopstateTracker()

    const popstateToken = readRecentPopstateToken()
    const hasNewPopstateToken =
      popstateToken != null && popstateToken > lastHandledPopstateTokenRef.current
    const shouldRestore = hasNewPopstateToken || isBackForwardNavigation()

    // Restore saved position once (instant, no animation)
    if (!restoredRef.current) {
      restoredRef.current = true
      if (shouldRestore) {
        try {
          const saved = sessionStorage.getItem(PREFIX + key)
          if (saved != null) {
            const idx = parseInt(saved, 10)
            if (!Number.isNaN(idx)) emblaApi.scrollTo(idx, true)
          }
        } catch {}
      }

      if (hasNewPopstateToken && popstateToken != null) {
        lastHandledPopstateTokenRef.current = popstateToken
      }
    }

    // Save position on every slide change
    const onSelect = () => {
      try {
        sessionStorage.setItem(PREFIX + key, String(emblaApi.selectedScrollSnap()))
      } catch {}
    }

    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, key])
}
