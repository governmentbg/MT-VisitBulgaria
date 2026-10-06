'use client'

import { cn } from '@/components/ui/theme/cn'
import { useLocale } from 'next-intl'
import * as React from 'react'

export interface DateOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date | string
  locale?: string
  ref?: React.Ref<HTMLDivElement>
}

function getMonthAbbr(date: Date, locale: string): string {
  let month = date.toLocaleDateString(locale, { month: 'short', timeZone: 'UTC' })
  // Some locales (e.g. bg) return numeric short months — fall back to long and truncate
  if (/^\d+$/.test(month.replace(/\./g, '').trim())) {
    month = date.toLocaleDateString(locale, { month: 'long', timeZone: 'UTC' }).slice(0, 3)
  }
  return month.toUpperCase().replace('.', '')
}

function useSafeLocale(): string {
  try {    
    return useLocale()
  } catch {
    return 'en'
  }
}

const DateOverlay: React.FC<DateOverlayProps> = ({
  date,
  locale: localeProp,
  className,
  ref,
  ...props
}) => {
  const intlLocale = useSafeLocale()
  const locale = localeProp ?? intlLocale

  const d = typeof date === 'string' ? new Date(date) : date
  const month = getMonthAbbr(d, locale)
  const day = d.getUTCDate()
  const year = d.getUTCFullYear()

  return (
    <div
      className={cn(
        'flex w-[5.625rem] flex-col items-center gap-1 rounded-2xl bg-white px-4 pt-4 pb-4 shadow-[0px_1.25rem_1.5625rem_0px_rgba(0,0,0,0.1),0px_0.5rem_0.625rem_0px_rgba(0,0,0,0.1)]',
        className,
      )}
      ref={ref}
      {...props}
    >
      <span className="text-sm font-extrabold uppercase leading-5 tracking-wide text-black">
        {month}
      </span>
      <span className="text-[1.875rem] font-extrabold leading-[1.875rem] text-primary">
        {day}
      </span>
      <span className="text-sm font-extrabold leading-5 tracking-wide text-black">
        {year}
      </span>
    </div>
  )
}

export { DateOverlay, DateOverlay as DataOverlay }
export type { DateOverlayProps as DataOverlayProps }
