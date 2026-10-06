import { cn } from '@/components/ui/theme/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import { Link } from '@/i18n/routing'
import * as React from 'react'

const linkIconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-full box-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    defaultVariants: {
      size: 'md',
      variant: 'secondary',
    },
    variants: {
      size: {
        sm: 'size-9 [&_svg]:size-4 [&_svg]:stroke-current [&_svg]:stroke-[0.5px]',
        md: 'size-12 [&_svg]:size-5 [&_svg]:stroke-current [&_svg]:stroke-[0.5px]',
      },
      variant: {
        secondary: 'bg-grey-100 text-grey-600 hover:bg-grey-200 hover:text-grey-800',
        primary: 'bg-primary-700 text-white hover:opacity-90',
        transparent: 'bg-white/20 text-white hover:bg-white/30',
        ghost: 'bg-grey-50 text-grey-600 hover:bg-grey-200',
      },
    },
  },
)

export interface LinkIconButtonProps extends VariantProps<typeof linkIconButtonVariants> {
  href: string
  icon: React.ReactNode
  label: string
  newTab?: boolean
  className?: string
}

const LinkIconButton: React.FC<LinkIconButtonProps> = ({
  href,
  icon,
  label,
  variant,
  size,
  newTab,
  className,
}) => {
  const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')
  const classes = cn(linkIconButtonVariants({ variant, size }), className)
  const tabProps = newTab || isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}

  if (isExternal) {
    return (
      <a href={href} className={classes} aria-label={label} {...tabProps}>
        {icon}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} aria-label={label} {...tabProps}>
      {icon}
    </Link>
  )
}

export { LinkIconButton, linkIconButtonVariants }
