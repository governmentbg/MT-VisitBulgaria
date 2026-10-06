import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { buttonVariants } from './Button'
import type { VariantProps } from 'class-variance-authority'
import { Link } from '@/i18n/routing'
import * as React from 'react'

export interface LinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof buttonVariants> {
  href: string
  icon?: React.ReactNode
  newTab?: boolean
  ref?: React.Ref<HTMLAnchorElement>
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  className,
  size,
  variant,
  icon = <SpriteIcon name="arrow-up-right" />,
  newTab,
  ref,
  children,
  ...props
}) => {
  const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')
  const classes = cn(buttonVariants({ size, variant }), className)
  const tabProps = newTab || isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}

  if (isExternal) {
    return (
      <a href={href} className={classes} ref={ref} {...tabProps} {...props}>
        {children}
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
      </a>
    )
  }
  
  const linkProps = props as any

  return (
    <Link href={href} className={classes} ref={ref} {...tabProps} {...linkProps}>
      {children}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </Link>
  )
}

export { LinkButton }
