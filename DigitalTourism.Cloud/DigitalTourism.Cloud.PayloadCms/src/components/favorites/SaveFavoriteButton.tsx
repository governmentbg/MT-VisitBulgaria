'use client'

import React from 'react'
import { cn, LikeButton } from '@/components/ui'
import { useFavorites } from './useFavorites'

export interface SaveFavoriteButtonProps {
  /** Collection slug, e.g. "hotels", "events", "attractions" */
  collectionSlug: string
  /** Numeric experience ID */
  id: number
  /** Label shown next to the heart when not yet favorited (e.g. "Save to favorites") */
  saveLabel?: string
  /** Label shown next to the heart when already favorited (e.g. "Saved") */
  savedLabel?: string
  /** LikeButton size */
  size?: 'sm' | 'md' | 'lg'
  /** LikeButton variant */
  variant?: 'primary' | 'secondary'
  /** Whether to show the text label alongside the heart icon */
  showLabel?: boolean
  className?: string
}

export const SaveFavoriteButton: React.FC<SaveFavoriteButtonProps> = ({
  collectionSlug,
  id,
  saveLabel = 'Save',
  savedLabel = 'Saved',
  size = 'lg',
  variant = 'primary',
  showLabel = true,
  className,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favoriteId = `${collectionSlug}_${id}`
  const isLiked = isFavorite(favoriteId)
  const label = isLiked && savedLabel ? savedLabel : saveLabel

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn('group/fav flex items-center gap-2 sm:gap-3 cursor-pointer', className)}
      onClick={() => toggleFavorite(favoriteId)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleFavorite(favoriteId)
        }
      }}
    >
      <LikeButton
        liked={isLiked}
        size={size}
        variant={variant}
        className="pointer-events-none [@media(hover:hover)]:group-hover/fav:bg-primary-100"
      />
      {showLabel && (
        <span className="hidden text-lg font-normal text-primary-700 whitespace-nowrap transition-colors [@media(hover:hover)]:group-hover/fav:text-primary-900 sm:inline">
          {label}
        </span>
      )}
    </div>
  )
}
