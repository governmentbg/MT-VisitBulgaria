import { cn } from '@/components/ui/theme/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const statusDotVariants = cva('inline-block rounded-full', {
  defaultVariants: {
    color: 'success',
    size: 'sm',
  },
  variants: {
    size: {
      xs: 'size-1.5',
      sm: 'size-2',
      md: 'size-3',
    },
    color: {
      success: 'bg-green-500',
      warning: 'bg-yellow-400',
      error: 'bg-red-500',
      primary: 'bg-primary',
    },
  },
})

export interface StatusDotProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof statusDotVariants> {
  /** Subtle pulsing animation for active/online indicators */
  pulse?: boolean
  /** Expanding ring animation for "live" indicators */
  ping?: boolean
}

const StatusDot: React.FC<StatusDotProps> = ({
  color,
  size,
  pulse,
  ping,
  className,
  ...props
}) => {
  if (ping) {
    return (
      <span className={cn('relative inline-flex', statusDotVariants({ size }))} {...props}>
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            statusDotVariants({ color }),
          )}
        />
        <span
          className={cn('relative inline-flex h-full w-full rounded-full', statusDotVariants({ color }))}
        />
      </span>
    )
  }

  return (
    <span
      className={cn(statusDotVariants({ color, size }), pulse && 'animate-pulse', className)}
      {...props}
    />
  )
}

export { StatusDot, statusDotVariants }
