import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

import type { Metadata } from 'next'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function LockedLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <html lang={locale} data-theme="light" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link rel="preload" href="/fonts/montserrat-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/montserrat-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#fafafa' }}>
        {children}
      </body>
    </html>
  )
}
