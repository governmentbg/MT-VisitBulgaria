import { HeaderClient } from './Component.client'
import { getCachedMainMenu } from '@/utilities/getGlobals'
import { getLocale } from 'next-intl/server'
import React from 'react'

import type { PayloadLocale } from '@/i18n/localization'

export async function Header() {
  const locale = (await getLocale()) as PayloadLocale
  const mainMenu = await getCachedMainMenu(locale)()

  // Only pass lightweight data needed for initial tab rendering (labels + dropdown indicators).
  // Full nav data (navItems, images) is lazy-loaded on first dropdown/menu open.
  const tabHeaders =
    mainMenu.tabs?.map(({ label, enableDirectLink, enableDropdown, link, dropdownType }) => ({
      label,
      enableDirectLink,
      enableDropdown,
      link,
      dropdownType,
    })) ?? []

  return <HeaderClient tabHeaders={tabHeaders} locale={locale} />
}
