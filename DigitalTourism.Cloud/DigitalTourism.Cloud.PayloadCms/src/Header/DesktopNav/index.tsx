'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { CMSLink } from '@/components/Link'
import {
  ChevronUpRegular,
  MapRegular,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { LinkIconButton } from '@/components/ui'
import { VisitorMenu } from '@/components/VisitorMenu'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

import type { MainMenu } from '@/payload-types'
import type { TabHeader } from '../Component.client'
import { MegaMenuOverlay } from './MegaMenuOverlay'
import { type NavTheme, navThemeConfig } from '../types'

type DesktopNavProps = {
  tabHeaders: TabHeader[]
  fullTabs: MainMenu['tabs'] | null
  theme?: NavTheme
  iconMap?: Record<string, React.ComponentType<{ className?: string }>>
  onDropdownOpen: () => void
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  tabHeaders,
  fullTabs,
  theme = 'solid',
  iconMap,
  onDropdownOpen,
}) => {
  const t = useTranslations('common')
  const tNav = useTranslations('navigation')
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const handleTabClick = (index: number, hasDropdown: boolean) => {
    if (!hasDropdown) return
    onDropdownOpen()
    setActiveTab((prev) => (prev === index ? null : index))
  }

  const closeDropdown = () => {
    setActiveTab(null)
  }

  // Close on click outside or Escape key
  useEffect(() => {
    if (activeTab === null) return
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveTab(null)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTab(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [activeTab])

  const themeConfig = navThemeConfig[theme]
  const textColor = themeConfig.textColor

  return (
    <nav className="hidden lg:flex flex-1 items-center justify-between relative ml-8 min-w-0" ref={navRef}>
      {/* Center: Menu items */}
      <div className="flex items-center gap-6 xl:gap-8 min-w-0">
        {tabHeaders.map((tab, index) => {
          const hasDropdown = tab.enableDropdown
          const isActive = activeTab === index

          return (
            <React.Fragment key={index}>
              {tab.enableDirectLink && !tab.enableDropdown ? (
                <CMSLink
                  {...tab.link}
                  label={tab.label}
                  appearance="inline"
                  className={`flex items-center gap-1 font-sans text-[18px] leading-[150%] font-semibold no-underline whitespace-nowrap ${textColor} ${themeConfig.tabClass}`}
                  onClick={closeDropdown}
                />
              ) : (
                <button
                  onClick={() => handleTabClick(index, !!hasDropdown)}
                  className={`flex items-center gap-1 font-sans text-[18px] leading-[150%] font-semibold whitespace-nowrap ${
                    isActive ? themeConfig.tabActiveClass : `${textColor} ${themeConfig.tabClass}`
                  }`}
                  style={isActive && theme !== 'solid' ? { color: 'var(--color-grey-900)' } : undefined}
                >
                  {tab.label}
                  {hasDropdown &&
                    (isActive ? (
                      <ChevronUpRegular className="size-5" />
                    ) : (
                      <SpriteIcon name="chevron-down" className="size-5" />
                    ))}
                </button>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-[9px]">
        {/* Search button */}
        <LinkIconButton
          href="/search"
          icon={<SpriteIcon name="search" />}
          label={t('search')}
          variant={themeConfig.iconButtonVariant}
        />

        {/* Map button */}
        <LinkIconButton
          href="/map"
          icon={<MapRegular />}
          label={tNav('map')}
          variant={themeConfig.iconButtonVariant}
        />

        {/* Language switcher */}
        <LanguageSwitcher closedClassName={themeConfig.langSwitcherClosed} />

        {/* Login / Profile button */}
        <VisitorMenu />
      </div>

      {/* Mega Menu Overlay — only renders when full data is loaded */}
      {activeTab !== null && fullTabs?.[activeTab]?.enableDropdown && (
        <MegaMenuOverlay
          tab={fullTabs[activeTab]}
          onClose={closeDropdown}
          iconMap={iconMap}
        />
      )}
    </nav>
  )
}
