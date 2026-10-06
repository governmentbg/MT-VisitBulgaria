'use client'

import { cn } from '@/components/ui/theme/cn'
import { getDayBadgeColor } from '@/utilities/getDayBadgeColor'
import { type VariantProps, cva } from 'class-variance-authority'

const dayBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium font-sans shrink-0',
  {
    defaultVariants: { size: 'md' },
    variants: {
      size: {
        sm: 'h-6 w-[26px] text-xs',
        md: 'h-8 w-8 text-sm',
      },
    },
  },
)

export interface DayBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof dayBadgeVariants> {
  dayNumber: number
  /** Override the displayed text (defaults to dayNumber) */
  label?: number | string
}

export const DayBadge: React.FC<DayBadgeProps> = ({
  dayNumber,
  label,
  size,
  className,
  style,
  ...props
}) => {
  return (
    <span
      className={cn(dayBadgeVariants({ size }), 'text-white', className)}
      style={{ backgroundColor: getDayBadgeColor(dayNumber - 1), ...style }}
      {...props}
    >
      {label ?? dayNumber}
    </span>
  )
}
