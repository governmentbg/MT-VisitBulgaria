import { cn } from '@/components/ui/theme/cn'
import { type VariantProps } from 'class-variance-authority'
import { linkIconButtonVariants } from './LinkIconButton'
import * as React from 'react'

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof linkIconButtonVariants> {
  icon: React.ReactNode
  label: string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant, size, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(linkIconButtonVariants({ variant, size }), className)}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  ),
)
IconButton.displayName = 'IconButton'

export { IconButton }
