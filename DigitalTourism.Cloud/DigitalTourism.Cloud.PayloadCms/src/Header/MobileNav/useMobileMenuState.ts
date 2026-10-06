import { useState, useCallback } from 'react'

export interface DrillDownState {
  isOpen: boolean
  level: 1 | 2 | 3
  tabIndex: number | null
  navItemIndex: number | null
  direction: 'forward' | 'back'
}

const initialState: DrillDownState = {
  isOpen: false,
  level: 1,
  tabIndex: null,
  navItemIndex: null,
  direction: 'forward',
}

export function useMobileMenuState() {
  const [state, setState] = useState<DrillDownState>(initialState)

  const open = useCallback(() => {
    setState({ ...initialState, isOpen: true, direction: 'forward' })
  }, [])

  const close = useCallback(() => {
    setState(initialState)
  }, [])

  const drillDown = useCallback((tabIndex: number) => {
    setState((prev) => ({
      ...prev,
      level: 2,
      tabIndex,
      navItemIndex: null,
      direction: 'forward',
    }))
  }, [])

  const drillToLinks = useCallback((navItemIndex: number) => {
    setState((prev) => ({
      ...prev,
      level: 3,
      navItemIndex,
      direction: 'forward',
    }))
  }, [])

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.level === 3) {
        return { ...prev, level: 2, navItemIndex: null, direction: 'back' }
      }
      if (prev.level === 2) {
        return { ...prev, level: 1, tabIndex: null, navItemIndex: null, direction: 'back' }
      }
      return prev
    })
  }, [])

  return { state, open, close, drillDown, drillToLinks, goBack }
}
