'use client'

import { cn } from '@/components/ui/theme/cn'
import { PersonRegular } from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import * as React from 'react'
import { Link } from '@/i18n/routing'
import { Button } from '../../primitives/Button'

export interface MenuItem {
  label: string
  href?: string
  onClick?: () => void
}

export interface NavigationBarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  menuItems?: MenuItem[]
  onLogin?: () => void
  onSearch?: () => void
  currentLocale?: string
  onLocaleChange?: () => void
  userAvatar?: React.ReactNode
  isLoggedIn?: boolean
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  logo,
  menuItems = [],
  onLogin,
  onSearch,
  currentLocale,
  onLocaleChange,
  userAvatar,
  isLoggedIn = false,
  fixed = false,
  className,
  ref,
  ...props
}) => {
  return (
    <nav
      className={cn(
        'flex w-full items-center justify-between bg-white px-6 py-3 font-sans',
        fixed && 'fixed top-0 left-0 z-50 shadow-sm',
        className,
      )}
      ref={ref}
      {...props}
    >
      {/* Logo */}
      <div className="flex shrink-0 items-center">
        {logo || <span className="text-lg font-bold text-primary">VisitBG</span>}
      </div>

      {/* Center menu items */}
      <div className="hidden items-center gap-1 md:flex">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href ?? '#'}
            onClick={item.onClick}
            className="rounded-full px-4 py-2 text-sm font-medium text-grey-700 transition-colors hover:bg-grey-25 hover:text-grey-900"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {onSearch && (
          <button
            type="button"
            onClick={onSearch}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-grey-600 transition-colors hover:bg-grey-25"
          >
            <SpriteIcon name="search" className="h-5 w-5" />
          </button>
        )}
        {currentLocale && onLocaleChange && (
          <button
            type="button"
            onClick={onLocaleChange}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-grey-600 transition-colors hover:bg-grey-25"
          >
            {currentLocale.toUpperCase()}
          </button>
        )}
        {isLoggedIn && userAvatar ? (
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-grey-100">
            {userAvatar}
          </div>
        ) : isLoggedIn ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
            <PersonRegular className="h-5 w-5" />
          </div>
        ) : null}
        {!isLoggedIn && onLogin && (
          <Button variant="primary" size="sm" onClick={onLogin}>
            Вход
          </Button>
        )}
      </div>
    </nav>
  )
}

export { NavigationBar }
