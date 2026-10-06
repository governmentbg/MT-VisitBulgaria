'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { GlobeRegular } from '@/components/ui/icons'
import { LOCALE_CODES } from '@/i18n/localization'
import { LanguageOverlay } from '@/components/ui'
import { useAlternateUrls } from '@/providers/AlternateUrls'

export function LanguageSwitcher({
  closedClassName = 'bg-grey-100 text-grey-600 hover:bg-grey-200 hover:text-grey-800',
}: {
  closedClassName?: string
} = {}) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { alternateUrls } = useAlternateUrls()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleChange = (newLocale: string) => {
    setIsOpen(false)
    const alternateUrl = alternateUrls[newLocale]
    if (alternateUrl) {
      // Navigate to the locale-specific slug for this page
      router.replace(alternateUrl, { locale: newLocale })
    } else {
      // Non-page routes (search, map, account) — preserve current pathname
      router.replace({ pathname }, { locale: newLocale })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex size-12 items-center justify-center rounded-full box-border p-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          isOpen
            ? 'bg-primary-700 text-white'
            : closedClassName
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <GlobeRegular className="size-5 stroke-current stroke-[0.5px]" />
      </button>

      {isOpen && (
        <LanguageOverlay
          locales={[...LOCALE_CODES]}
          current={locale}
          onChange={handleChange}
          className="absolute right-0 top-full mt-4 z-100 shadow-[0_0_20px_rgba(0,0,0,0.12)]"
        />
      )}
    </div>
  )
}
