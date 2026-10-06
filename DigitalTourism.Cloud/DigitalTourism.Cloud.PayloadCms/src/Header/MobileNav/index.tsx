'use client'

import React, { useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import {
  MapRegular,
  DismissRegular,
  NavigationRegular,
  PersonRegular,
  FlowRegular,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { LinkIconButton, linkIconButtonVariants } from '@/components/ui/primitives/LinkIconButton'
import { MobileMenuOverlay } from '@/components/ui/composites/navigation/MobileMenuOverlay'
import { MobileMenuHeader } from '@/components/ui/composites/navigation/MobileMenuHeader'
import { MobileMenuActions } from '@/components/ui/composites/navigation/MobileMenuActions'
import type { MobileMenuAction } from '@/components/ui/composites/navigation/MobileMenuHeader'
import { Logo } from '@/components/Logo/Logo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useAuth } from '@/providers/Auth'

import type { MainMenu } from '@/payload-types'
import type { TabHeader } from '../Component.client'
import { useMobileMenuState } from './useMobileMenuState'
import { mapTabsToLevel } from './mapMenuData'

type MobileNavProps = {
  tabHeaders: TabHeader[]
  fullTabs: MainMenu['tabs'] | null
  onMenuOpen: () => void
}

export const MobileNav: React.FC<MobileNavProps> = ({ tabHeaders: _tabHeaders, fullTabs, onMenuOpen }) => {
  const t = useTranslations('common')
  const tNav = useTranslations('navigation')
  const { isAuthenticated, logout, openAuthDialog } = useAuth()
  const { state, open, close, drillDown, drillToLinks, goBack } = useMobileMenuState()

  // Use full tabs for menu content once loaded, otherwise empty items
  const level = useMemo(
    () =>
      fullTabs
        ? mapTabsToLevel(fullTabs, state, {
            drillDown,
            drillToLinks,
            onNavigate: close,
            mainMenuLabel: tNav('mainMenu'),
          })
        : { items: [] },
    [fullTabs, state, drillDown, drillToLinks, close, tNav],
  )

  const handleOpen = useCallback(() => {
    onMenuOpen()
    open()
  }, [onMenuOpen, open])

  const headerActions: MobileMenuAction[] = useMemo(
    () => [
      { icon: <SpriteIcon name="search" />, label: t('search'), href: '/search', onClick: close },
      { node: <LanguageSwitcher /> },
      { icon: <DismissRegular />, label: tNav('closeMenu'), onClick: close },
    ],
    [t, tNav, close],
  )

  const headerSlot = useMemo(
    () => (
      <MobileMenuHeader
        logo={
          <Link href="/" onClick={close}>
            <Logo loading="eager" priority="high" variant="dark" size="default" />
          </Link>
        }
        actions={headerActions}
      />
    ),
    [headerActions, close],
  )

  const footerSlot = useMemo(
    () => (
      <MobileMenuActions
        actions={[
          { label: tNav('map'), icon: <MapRegular className="text-white" />, href: '/map', onClick: close, fullWidth: !isAuthenticated },
          ...(isAuthenticated
            ? [
                {
                  label: tNav('favorites'),
                  icon: <SpriteIcon name="heart-regular" className="text-white" />,
                  href: '/account/favourites',
                  onClick: close,
                },
                {
                  label: tNav('myTrips'),
                  icon: <FlowRegular className="text-white" />,
                  href: '/account/trips',
                  onClick: close,
                },
                {
                  label: tNav('myAccount'),
                  icon: <PersonRegular className="text-white" />,
                  href: '/account',
                  onClick: close,
                },
                {
                  label: t('logout'),
                  fullWidth: true,
                  onClick: () => {
                    close()
                    logout()
                  },
                },
              ]
            : [
                {
                  label: t('login'),
                  fullWidth: true,
                  onClick: () => {
                    close()
                    openAuthDialog('login')
                  },
                },
              ]),
        ]}
      />
    ),
    [tNav, t, isAuthenticated, close, logout, openAuthDialog],
  )

  return (
    <div className="lg:hidden">
      {/* Mobile header trigger actions */}
      <div className="flex items-center gap-[9px]">
        <LinkIconButton
          href="/search"
          icon={<SpriteIcon name="search" />}
          label={t('search')}
          variant="secondary"
        />
        <LanguageSwitcher />
        <button
          onClick={handleOpen}
          className={linkIconButtonVariants({ variant: 'secondary', size: 'md' })}
          aria-label={tNav('openMenu')}
          aria-expanded={state.isOpen}
        >
          <NavigationRegular />
        </button>
      </div>

      {/* Full-screen drill-down menu */}
      <MobileMenuOverlay
        isOpen={state.isOpen}
        level={level}
        onBack={state.level > 1 ? goBack : undefined}
        onClose={close}
        headerSlot={headerSlot}
        footerSlot={footerSlot}
        direction={state.direction}
      />
    </div>
  )
}
