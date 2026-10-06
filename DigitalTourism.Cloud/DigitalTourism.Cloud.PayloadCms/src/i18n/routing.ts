import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import localization from './localization'

export const routing = defineRouting({
  locales: localization.locales.map((l) => l.code),
  defaultLocale: localization.defaultLocale,
  localePrefix: 'always',  
  localeDetection: false,
})

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)

export type Locale = (typeof routing.locales)[number]
