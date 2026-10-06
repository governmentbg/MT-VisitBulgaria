'use client'

import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react'
import { useAuth } from '@/providers/Auth'
import { toast } from 'sonner'
import type { Favorite } from '@/payload-types'
import type { UseFavoritesReturn } from './useFavorites'

function buildFavoritesMap(docs: Favorite[]): Record<string, number> {
  const favMap: Record<string, number> = {}
  docs.forEach((fav) => {
    const exp = fav.experience as
      | { relationTo: string; value: number | { id: number } }
      | null
      | undefined
    if (!exp) return
    const rawValue = exp.value
    const numId = typeof rawValue === 'number' ? rawValue : rawValue?.id
    if (numId != null) {
      favMap[`${exp.relationTo}_${numId}`] = fav.id
    }
  })
  return favMap
}

const FavoritesContext = createContext<UseFavoritesReturn | null>(null)

export function useFavoritesContext(): UseFavoritesReturn {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider')
  }
  return ctx
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, visitor, openAuthDialog } = useAuth()
  const [favorites, setFavorites] = useState<Record<string, number>>({})
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  const [togglingFavorites, setTogglingFavorites] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isAuthenticated && visitor) {
      const controller = new AbortController()
      const fetchFavorites = async () => {
        setLoadingFavorites(true)
        try {
          const res = await fetch(`/api/favorites?depth=0&limit=1000`, {
            signal: controller.signal,
          })
          if (res.ok) {
            const data = await res.json()
            setFavorites(buildFavoritesMap(data.docs))
          }
        } catch (error) {
          if ((error as Error).name !== 'AbortError') {
            console.error('Error fetching favorites:', error)
          }
        } finally {
          setLoadingFavorites(false)
        }
      }
      fetchFavorites()
      return () => controller.abort()
    } else {
      setFavorites({})
    }
  }, [isAuthenticated, visitor])

  const toggleFavorite = useCallback(
    async (experienceId: string) => {
      if (!isAuthenticated || !visitor) {
        openAuthDialog('login')
        return
      }

      if (togglingFavorites[experienceId]) return

      const isFav = !!favorites[experienceId]
      const favoriteId = favorites[experienceId]

      setTogglingFavorites((prev) => ({ ...prev, [experienceId]: true }))

      try {
        if (isFav) {
          const res = await fetch(`/api/favorites/${favoriteId}`, {
            method: 'DELETE',
          })

          if (res.ok) {
            setFavorites((prev) => {
              const next = { ...prev }
              delete next[experienceId]
              return next
            })
            toast.success('Removed from favorites')
          } else {
            toast.error('Failed to remove favorite')
          }
        } else {
          const underscoreIdx = experienceId.indexOf('_')
          const relationTo =
            underscoreIdx > 0 ? experienceId.slice(0, underscoreIdx) : 'attractions'
          const numericId =
            underscoreIdx > 0 ? Number(experienceId.slice(underscoreIdx + 1)) : Number(experienceId)
          const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              experience: { relationTo, value: numericId },
            }),
          })

          if (res.ok) {
            const newFav = await res.json()
            setFavorites((prev) => ({ ...prev, [experienceId]: newFav.doc.id }))
            toast.success('Added to favorites')
          } else {
            toast.error('Failed to add favorite')
          }
        }
      } catch (error) {
        console.error('Error toggling favorite:', error)
        toast.error('Something went wrong')
      } finally {
        setTogglingFavorites((prev) => {
          const next = { ...prev }
          delete next[experienceId]
          return next
        })
      }
    },
    [isAuthenticated, visitor, openAuthDialog, favorites, togglingFavorites],
  )

  const isFavorite = useCallback(
    (experienceId: string) => !!favorites[experienceId],
    [favorites],
  )

  const value = useMemo<UseFavoritesReturn>(
    () => ({
      favorites,
      loadingFavorites,
      togglingFavorites,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, loadingFavorites, togglingFavorites, toggleFavorite, isFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
