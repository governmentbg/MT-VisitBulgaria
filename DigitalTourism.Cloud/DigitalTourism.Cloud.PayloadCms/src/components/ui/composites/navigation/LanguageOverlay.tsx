'use client'

import { cn } from '@/components/ui/theme/cn'
import * as React from 'react'
import { GB, BG, DE, FR, RU } from 'country-flag-icons/react/1x1'

const FLAG_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  en: GB,
  bg: BG,
  de: DE,
  fr: FR,
  ru: RU,
}

const LABEL_MAP: Record<string, string> = {
  en: 'English',
  bg: 'Български',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский',
}

export interface LanguageOverlayProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  locales: string[]
  current: string
  onChange: (locale: string) => void
  ref?: React.Ref<HTMLElement>
}

const LanguageOverlay: React.FC<LanguageOverlayProps> = ({
  locales,
  current,
  onChange,
  className,
  ref,
  ...props
}) => {
  return (
    <nav
      className={cn(
        'min-w-[220px] rounded-2xl bg-white p-6 font-sans',
        className,
      )}
      ref={ref}
      aria-label="Select language"
      {...props}
    >
      <ul className="flex flex-col gap-4 list-none m-0 p-0">
        {locales.map((code) => {
          const Flag = FLAG_MAP[code]
          const label = LABEL_MAP[code] ?? code
          return (
            <li key={code}>
              <button
                type="button"
                aria-current={current === code ? 'true' : undefined}
                onClick={() => onChange(code)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg p-2 text-base leading-[1.5] font-normal text-[var(--color-button-primary)] transition-colors hover:bg-grey-25',
                  current === code && 'bg-grey-25',
                )}
              >
                {Flag && (
                  <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-none">
                    <Flag />
                  </span>
                )}
                <span className="text-left">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export { LanguageOverlay }
