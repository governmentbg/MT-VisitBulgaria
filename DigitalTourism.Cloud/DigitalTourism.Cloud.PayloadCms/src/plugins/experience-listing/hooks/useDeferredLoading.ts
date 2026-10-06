import { useEffect, useState } from 'react'

/**
 * Delays a loading flag so that fast responses never show a loading indicator.
 * Only returns `true` if `isPending` has been `true` for at least `delay` ms.
 */
export function useDeferredLoading(isPending: boolean, delay = 200): boolean {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (isPending) {
      const timer = setTimeout(() => setShowLoading(true), delay)
      return () => clearTimeout(timer)
    }
    setShowLoading(false)
  }, [isPending, delay])

  return showLoading
}
