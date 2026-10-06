'use client'

import { useFavoritesContext } from './FavoritesProvider'

export interface UseFavoritesReturn {
  favorites: Record<string, number>
  loadingFavorites: boolean
  togglingFavorites: Record<string, boolean>
  toggleFavorite: (experienceId: string) => Promise<void>
  isFavorite: (experienceId: string) => boolean
}

export function useFavorites(): UseFavoritesReturn {
  return useFavoritesContext()
}
