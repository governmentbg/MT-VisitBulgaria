import { cn } from '@/components/ui/theme/cn'
import {
  ChevronDoubleLeftRegular,
  ChevronDoubleRightRegular,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { Link } from '@/i18n/routing'
import * as React from 'react'

// ==================== Shared styles ====================

const pageClasses = (isActive?: boolean) =>
  cn(
    'flex h-14 w-14 items-center justify-center rounded-full text-base font-semibold transition-colors',
    isActive
      ? 'border-2 border-primary bg-primary text-white'
      : 'border-2 border-grey-50 bg-white text-grey-700 hover:bg-grey-50',
    'disabled:pointer-events-none disabled:opacity-50',
  )

const navClasses =
  'flex h-14 w-14 items-center justify-center rounded-full bg-grey-50 transition-colors hover:bg-grey-100 disabled:pointer-events-none disabled:opacity-40 disabled:border disabled:border-grey-50'

// ==================== Pagination Container ====================

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    aria-label="Pagination"
    role="navigation"
    className={cn('flex items-center justify-center gap-1', className)}
    {...props}
  />
)

// ==================== Page Button ====================

interface PaginationPageProps {
  isActive?: boolean
  href?: string
  disabled?: boolean
  prefetch?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
  children?: React.ReactNode
}

const PaginationPage: React.FC<PaginationPageProps> = ({
  isActive,
  href,
  disabled,
  prefetch,
  onClick,
  className,
  children,
  ...rest
}) => {
  const classes = cn(pageClasses(isActive), className)

  if (href && !disabled) {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        aria-current={isActive ? 'page' : undefined}
        className={classes}
        onClick={onClick}
        {...rest}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      disabled={disabled}
      className={classes}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}

// ==================== Ellipsis ====================

const PaginationEllipsis: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn('flex h-14 w-14 items-center justify-center text-base font-semibold text-grey-700', className)}
    {...props}
  >
    ...
  </span>
)

// ==================== Nav Button ====================

interface PaginationNavProps {
  icon: React.ReactNode
  label: string
  href?: string
  disabled?: boolean
  prefetch?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

const PaginationNav: React.FC<PaginationNavProps> = ({
  icon,
  label,
  href,
  disabled,
  prefetch,
  onClick,
  className,
  ...rest
}) => {
  const classes = cn(navClasses, className)

  if (href && !disabled) {
    return (
      <Link href={href} prefetch={prefetch} aria-label={label} className={classes} onClick={onClick} {...rest}>
        {icon}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={classes}
      onClick={onClick}
      {...rest}
    >
      {icon}
    </button>
  )
}

// ==================== Convenience wrappers ====================

const PaginationFirst: React.FC<Omit<PaginationNavProps, 'icon' | 'label'>> = (props) => (
  <PaginationNav icon={<ChevronDoubleLeftRegular className="h-5 w-5" />} label="First page" {...props} />
)

const PaginationPrevious: React.FC<Omit<PaginationNavProps, 'icon' | 'label'>> = (props) => (
  <PaginationNav icon={<SpriteIcon name="chevron-left" className="h-5 w-5" />} label="Previous page" {...props} />
)

const PaginationNext: React.FC<Omit<PaginationNavProps, 'icon' | 'label'>> = (props) => (
  <PaginationNav icon={<SpriteIcon name="chevron-right" className="h-5 w-5" />} label="Next page" {...props} />
)

const PaginationLast: React.FC<Omit<PaginationNavProps, 'icon' | 'label'>> = (props) => (
  <PaginationNav icon={<ChevronDoubleRightRegular className="h-5 w-5" />} label="Last page" {...props} />
)

export {
  Pagination,
  PaginationPage,
  PaginationEllipsis,
  PaginationNav,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
}
