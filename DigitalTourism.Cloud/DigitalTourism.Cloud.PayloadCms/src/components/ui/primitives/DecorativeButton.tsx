import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

/**
 * Mirrors `buttonVariants` but swaps every `hover:` prefix for `group-hover:`
 * so the visual hover effect triggers when the surrounding `group` container
 * is hovered — useful for stretched-link card patterns where the span itself
 * never receives a direct hover.
 */
const decorativeButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold font-sans leading-[1.4] transition-colors',
  {
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
    variants: {
      size: {
        xs: 'gap-2 px-7 py-3.5 text-sm [&_svg]:h-4 [&_svg]:w-4',
        sm: 'gap-2 px-7 py-[18px] text-sm [&_svg]:h-4 [&_svg]:w-4',
        md: 'gap-3 px-8 py-[21px] text-base [&_svg]:h-5 [&_svg]:w-5',
        lg: 'gap-4 px-10 py-6 text-lg [&_svg]:h-6 [&_svg]:w-6',
        icon: 'p-4 [&_svg]:h-6 [&_svg]:w-6',
        default: 'gap-3 px-8 py-[21px] text-base [&_svg]:h-4 [&_svg]:w-4',
        clear: '',
      },
      variant: {
        primary:
          'bg-primary text-white group-hover:bg-primary-600',
        secondary:
          'bg-grey-50 text-grey-900 group-hover:bg-primary-50 group-hover:text-primary-900',
        tertiary:
          'bg-transparent text-grey-900 underline underline-offset-4 group-hover:text-primary',
        dark:
          'bg-button-primary text-white group-hover:bg-button-primary-hover',
        destructive:
          'bg-error-100 text-white group-hover:bg-error-200',
        link: 'text-primary items-start justify-start underline-offset-4 group-hover:underline rounded-none',
        default:
          'bg-primary text-white group-hover:bg-primary-600',
        outline:
          'bg-grey-50 text-grey-900 group-hover:bg-primary-50 group-hover:text-primary-900',
        ghost:
          'bg-transparent text-grey-900 underline underline-offset-4 group-hover:text-primary',
      },
    },
  },
)

export interface DecorativeButtonProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof decorativeButtonVariants> {
  icon?: React.ReactNode
  ref?: React.Ref<HTMLSpanElement>
}

const DecorativeButton: React.FC<DecorativeButtonProps> = ({
  className,
  size,
  variant,
  icon = <SpriteIcon name="arrow-up-right" />,
  ref,
  children,
  ...props
}) => {
  return (
    <span
      aria-hidden="true"
      className={cn(decorativeButtonVariants({ className, size, variant }))}
      ref={ref}
      {...props}
    >
      {children}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </span>
  )
}

export { DecorativeButton, decorativeButtonVariants }
