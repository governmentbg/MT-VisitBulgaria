import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { getMyFavouritesAsSearchResults } from './actions'
import FavouritesPageClient from './page.client'
import { getSiteIdentity } from '@/utilities/getSettings'
import { formatPageTitle } from '@/utilities/generateMeta'
import type { PayloadLocale } from '@/i18n/localization'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale: string
  }>
}

export default async function FavouritesPage({ params }: Args) {
  const { locale } = await params
  const [favourites, allMessages] = await Promise.all([
    getMyFavouritesAsSearchResults(locale),
    getMessages(),
  ])

  return (
    <NextIntlClientProvider
      messages={{
        favourites: allMessages.favourites,
        experienceListing: allMessages.experienceListing,
        common: allMessages.common,
      }}
    >
      <div className="min-h-screen bg-grey-25">
        <div className="container py-10">
          <FavouritesPageClient initialFavourites={favourites} />
        </div>
      </div>
    </NextIntlClientProvider>
  )
}

export async function generateMetadata({ params }: Args) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'favourites' })
  const { siteName } = await getSiteIdentity(locale as PayloadLocale)

  return {
    title: formatPageTitle(t('title'), siteName),
  }
}
