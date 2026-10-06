'use client'

import { cn } from '@/components/ui/theme/cn'
import * as React from 'react'

export interface CategoryPillProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string
  active?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const CategoryPill: React.FC<CategoryPillProps> = ({
  label,
  active = false,
  className,
  ref,
  ...props
}) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium font-sans transition-colors whitespace-nowrap',
        active
          ? 'bg-primary text-white'
          : 'bg-grey-25 text-grey-700 hover:bg-grey-100',
        className,
      )}
      ref={ref}
      {...props}
    >
      {label}
    </button>
  )
}

export { CategoryPill }
