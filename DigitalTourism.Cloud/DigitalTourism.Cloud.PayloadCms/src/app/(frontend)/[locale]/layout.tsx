import type { Metadata } from 'next'

import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { GA4Script } from '@/components/GA4Script'
import { Providers } from '@/providers'
// import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getGA4Config } from '@/utilities/getGA4Config'
import { draftMode } from 'next/headers'
import { Toaster } from 'sonner'
import { routing } from '@/i18n/routing'
import { IconSprite } from '@/components/ui/IconSprite'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  await draftMode()
  const allMessages = await getMessages()
  // Only send namespaces needed by layout-level components to reduce HTML size.
  // Page-specific namespaces (search, posts, account, weather, pdf, types) should
  // use their own NextIntlClientProvider or server-side getTranslations().
  // Also include experienceListing + weather because these blocks are rendered via
  // Lexical converters (next/dynamic) which prevents their own server-side
  // NextIntlClientProvider from functioning.
  const messages = {
    common: allMessages.common,
    navigation: allMessages.navigation,
    footer: allMessages.footer,
    errors: allMessages.errors,
    auth: allMessages.auth,
    addToTrip: allMessages.addToTrip,
    experienceListing: allMessages.experienceListing,
    weather: allMessages.weather,
  }
  const ga4Config = await getGA4Config()

  return (
    <html
      lang={locale}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        {/* <InitTheme /> */}
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        {/* Preload critical font files to avoid FOUT */}
        <link rel="preload" href="/fonts/montserrat-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/montserrat-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/montserrat-alternates-latin-700-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/montserrat-alternates-cyrillic-700-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <IconSprite />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header />
            {children}
            <Footer />
            <Toaster position="bottom-right" richColors />
          </Providers>
        </NextIntlClientProvider>
        {ga4Config.enabled && <GA4Script measurementId={ga4Config.measurementId} />}
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { getCachedGlobal } = await import('@/utilities/getGlobals')
  const settings = await getCachedGlobal('settings', 0)() as import('@/payload-types').Setting
  const allowIndexing = settings.allowCrawlerIndexing === true

  return {
    metadataBase: new URL(getServerSideURL()),
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: {
        index: allowIndexing,
        follow: allowIndexing,
      },
    },
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
