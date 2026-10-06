'use client'

import React from 'react'
import { NavGroup } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export const AfterNavLinks: React.FC = () => {
  const pathname = usePathname()
  const href = '/admin/analytics'
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <NavGroup label={'Views'}>
      <Link
        href={href}
        className="nav__link"
        id="nav-analytics"
        style={{ cursor: isActive ? 'pointer' : 'auto', pointerEvents: isActive ? 'none' : 'auto' }}
      >
        {isActive && <div className="nav__link-indicator" />}
        <span className="nav__link-label">Analytics</span>
      </Link>
    </NavGroup>
  )
}

export default AfterNavLinks
