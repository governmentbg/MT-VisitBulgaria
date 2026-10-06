import clsx from 'clsx'
import React from 'react'

const sizes = {
  default: 'w-[87px] h-[67px]',
  large: 'w-[108px] h-[84px]',
} as const

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  /** Visual variant: 'dark' renders dark logo on light bg, 'light' keeps white logo for dark/transparent bg */
  variant?: 'dark' | 'light'
  size?: keyof typeof sizes
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    variant = 'dark',
    size = 'default',
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  const sizeValues = size === 'large' ? { w: 108, h: 84 } : { w: 87, h: 67 }

  return (
    <img
      alt="Visit Bulgaria"
      width={sizeValues.w}
      height={sizeValues.h}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx(
        sizes[size],
        variant === 'dark' && 'brightness-0',
        className,
      )}
      src="/logo.svg"
    />
  )
}
