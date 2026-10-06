import { cn } from '@/components/ui/theme/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const pillVariants = cva(
  'inline-flex items-center rounded-full font-medium font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
    variants: {
      size: {
        sm: 'h-6 px-2 text-xs',
        md: 'h-8 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
        xl: 'px-5 py-3 text-base',
      },
      variant: {
        default: 'bg-grey-25 text-black',
        brand: 'bg-brand-bg text-brand-text',
        success: 'bg-status-success-bg text-status-success-text',
        warning: 'bg-status-warning-bg text-status-warning-text',
        error: 'bg-status-error-bg text-status-error-text',
        info: 'bg-info-bg text-info-text',
        // Backwards-compatible aliases
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-border text-foreground',
      },
    },
  },
)

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {}

const Pill: React.FC<PillProps> = ({ className, size, variant, ...props }) => {
  return <span className={cn(pillVariants({ size, variant }), className)} {...props} />
}

export {
  Pill,
  pillVariants,
  Pill as Badge,
  pillVariants as badgeVariants,
}
export type { PillProps as BadgeProps }
