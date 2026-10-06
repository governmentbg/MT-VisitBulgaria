'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useAuth } from '@/providers/Auth'
import {
  PersonRegular,
  FlowRegular,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { CloseButton, Button } from '@/components/ui'
import { LoginButton } from './LoginButton'

export const VisitorMenu: React.FC = () => {
  const t = useTranslations('common')
  const tNav = useTranslations('navigation')
  const { visitor, isLoading, isAuthenticated, logout, openAuthDialog } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Loading state - matches size-12 (48px) of icon buttons
  if (isLoading) {
    return (
      <div className="size-12 rounded-full bg-grey-100 animate-pulse" />
    )
  }

  // Not authenticated - styled login button that opens dialog
  if (!isAuthenticated) {
    return (
      <LoginButton onClick={() => openAuthDialog('login')} />
    )
  }

  // Authenticated - circle with initials
  const initials = visitor?.name
    ? visitor.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : visitor?.email?.[0]?.toUpperCase() || 'V'

  const menuItems = [
    { label: tNav('favorites'), icon: <SpriteIcon name="heart-regular" className="h-5 w-5" />, href: '/account/favourites' },
    { label: tNav('myTrips'), icon: <FlowRegular className="h-5 w-5" />, href: '/account/trips' },
    { label: tNav('myAccount'), icon: <PersonRegular className="h-5 w-5" />, href: '/account' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-12 items-center justify-center rounded-full bg-primary text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={tNav('accountMenu')}
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 flex w-96 flex-col gap-6 rounded-[30px] bg-white p-0 shadow-2xl z-50">
          {/* Header with email and close button */}
          <div className="relative px-5 pt-6">
            <p className="text-base font-medium text-grey-900 pr-8">
              {visitor?.email}
            </p>
            <CloseButton
              size="sm"
              onClose={() => setIsOpen(false)}
              className="absolute right-5 top-6"
            />
          </div>

          {/* Menu items */}
          <div className="flex flex-col gap-2 px-5">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex h-14 items-center gap-4 rounded-[10px] px-4 text-body-sm font-medium text-grey-900 transition-colors hover:bg-grey-25"
              >
                <span className="flex shrink-0 items-center text-grey-900">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logout button */}
          <div className="flex justify-center px-5 pb-6">
            <Button
              variant="primary"
              icon={null}
              size="xs"
              className="w-[304px]"
              onClick={() => {
                setIsOpen(false)
                logout()
              }}
            >
              {t('logout')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
