'use client'

import React from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { cn } from '@/components/ui'

export interface FavoriteButtonProps {
  experienceId: string
  isFavorite: boolean
  onToggle: (experienceId: string) => void
  isLoading?: boolean
  isPending?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'floating' | 'inline'
}

const sizeClasses = {
  sm: 'p-1 w-4 h-4',
  md: 'p-1.5 w-5 h-5',
  lg: 'p-2 w-6 h-6',
}

const variantClasses = {
  floating: 'rounded-full bg-background/80 hover:bg-background transition-colors',
  inline: 'rounded hover:bg-muted/50 transition-colors',
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  experienceId,
  isFavorite,
  onToggle,
  isLoading = false,
  isPending = false,
  className,
  size = 'md',
  variant = 'floating',
}) => {
  const iconSize = sizeClasses[size].split(' ')[2]

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle(experienceId)
      }}
      disabled={isPending || isLoading}
      className={cn(
        sizeClasses[size].split(' ').slice(0, 1).join(' '),
        variantClasses[variant],
        'disabled:opacity-50',
        className,
      )}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSize, 'animate-spin text-muted-foreground')} />
      ) : (
        <Heart
          className={cn(
            iconSize,
            'transition-colors',
            isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground',
          )}
        />
      )}
    </button>
  )
}
