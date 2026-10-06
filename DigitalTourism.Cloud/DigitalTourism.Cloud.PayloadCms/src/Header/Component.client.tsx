'use client'
import { Link } from '@/i18n/routing'
import React, { useCallback } from 'react'

import type { MainMenu } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'
import { navThemeConfig } from './types'
import { useNavData } from './useNavData'

export type TabHeader = Pick<
  NonNullable<MainMenu['tabs']>[number],
  'label' | 'enableDirectLink' | 'enableDropdown' | 'link' | 'dropdownType'
>

interface HeaderClientProps {
  tabHeaders: TabHeader[]
  locale: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ tabHeaders, locale }) => {
  const { headerTheme } = useHeaderTheme()
  const { tabs: fullTabs, ensureLoaded } = useNavData(locale)

  const navTheme = headerTheme
  const themeConfig = navThemeConfig[navTheme]

  const handleDropdownOpen = useCallback(() => {
    ensureLoaded()
  }, [ensureLoaded])

  return (
    <header className={`relative z-50 ${themeConfig.headerClass}`}>
      <div className="container flex items-center justify-between py-5">
        <Link href="/" className="flex-shrink-0">
          <Logo
            loading="eager"
            priority="high"
            variant={themeConfig.logoVariant}
            size={themeConfig.logoSize}
          />
        </Link>
        <DesktopNav
          tabHeaders={tabHeaders}
          fullTabs={fullTabs}
          theme={navTheme}
          onDropdownOpen={handleDropdownOpen}
        />
        <MobileNav
          tabHeaders={tabHeaders}
          fullTabs={fullTabs}
          onMenuOpen={handleDropdownOpen}
        />
      </div>
    </header>
  )
}
