'use client'

import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import * as React from 'react'

const sizeMap = {
  sm: { button: 'p-1.5', icon: 'h-4 w-4' },
  md: { button: 'p-2', icon: 'h-5 w-5' },
  lg: { button: 'p-2.5', icon: 'h-6 w-6' },
} as const

const variantStyles = {
  primary: 'bg-primary-50 text-primary-900 [@media(hover:hover)]:hover:text-primary-700',
  secondary: 'bg-white text-primary-900 shadow-lg [@media(hover:hover)]:hover:text-primary-700',
} as const

export interface LikeButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'size' | 'onToggle'> {
  liked?: boolean
  onToggle?: (liked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
  ref?: React.Ref<HTMLButtonElement>
}

const LikeButton: React.FC<LikeButtonProps> = ({
  liked = false,
  onToggle,
  size = 'md',
  variant = 'primary',
  className,
  ref,
  onClick,
  ...props
}) => {
  const { button, icon } = sizeMap[size]

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    if (!e.defaultPrevented) {
      onToggle?.(!liked)
    }
  }

  return (
    <button
      type="button"
      aria-label={liked ? 'Unlike' : 'Like'}
      aria-pressed={liked}
      className={cn(
        'group/like inline-flex items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50',
        button,
        variantStyles[variant],
        className,
      )}
      ref={ref}
      onClick={handleClick}
      {...props}
    >
      <span className="relative inline-flex items-center justify-center">
        {liked ? (
          <SpriteIcon name="heart-filled" className={cn(icon, 'transition-all')} />
        ) : (
          <>
            <SpriteIcon name="heart-regular" className={cn(icon, 'transition-opacity opacity-100 [@media(hover:hover)]:group-hover/like:opacity-0')} />
            <SpriteIcon name="heart-filled" className={cn(icon, 'absolute transition-opacity opacity-0 [@media(hover:hover)]:group-hover/like:opacity-100')} />
          </>
        )}
      </span>
    </button>
  )
}

export { LikeButton }
