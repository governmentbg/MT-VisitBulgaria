'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@payloadcms/ui'
import type { User } from '@/payload-types'
import './index.scss'

const baseClass = 'admin-profile-dropdown'

export const ProfileDropdown: React.FC = () => {
  const { user } = useAuth<User>()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || null
  const initials = displayName
    ? displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user.email?.[0]?.toUpperCase() ?? 'U')

  const handleLogout = () => {
    window.location.href = '/api/users/oauth/keycloak/logout'
  }

  return (
    <div className={baseClass} ref={menuRef}>
      <button
        className={`${baseClass}__trigger`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Profile menu"
        type="button"
      >
        <span className={`${baseClass}__avatar`}>{initials}</span>
        <span className={`${baseClass}__name`}>{displayName || user.email}</span>
      </button>

      {isOpen && (
        <div className={`${baseClass}__menu`}>
          <div className={`${baseClass}__user-info`}>
            <p className={`${baseClass}__user-name`}>{displayName || 'User'}</p>
            <p className={`${baseClass}__user-email`}>{user.email}</p>
          </div>
          <div className={`${baseClass}__divider`} />
          <Link
            href="/admin/account"
            className={`${baseClass}__menu-item`}
            onClick={() => setIsOpen(false)}
          >
            My Account
          </Link>
          <div className={`${baseClass}__divider`} />
          <button
            className={`${baseClass}__menu-item ${baseClass}__menu-item--logout`}
            onClick={handleLogout}
            type="button"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
