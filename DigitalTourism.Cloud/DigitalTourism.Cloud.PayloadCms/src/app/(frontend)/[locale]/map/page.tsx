import type { Metadata } from 'next/types'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale, getMessages, getTranslations } from 'next-intl/server'
import { MapPageClient } from './page.client'
import { getNomenclatureDisplayMap } from '@/lib/search'
import { getMapSettings, getFacetConfig, getSiteIdentity } from '@/utilities/getSettings'
import { formatPageTitle } from '@/utilities/generateMeta'
import type { PayloadLocale } from '@/i18n/localization'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'mapExplorer' })
  const { siteName } = await getSiteIdentity(locale as PayloadLocale)

  return {
    title: formatPageTitle(t('title'), siteName),
  }
}

export default async function MapPage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)

  const allMessages = await getMessages()
  const [nomenclatureMap, mapSettings, facetConfig] = await Promise.all([
    getNomenclatureDisplayMap(locale),
    getMapSettings(),
    getFacetConfig(),
  ])

  return (
    <NextIntlClientProvider
      messages={{
        mapExplorer: allMessages.mapExplorer,
        experienceListing: allMessages.experienceListing,
      }}
    >
      <MapPageClient locale={locale} nomenclatureMap={nomenclatureMap} zoomThreshold={mapSettings.zoomThreshold} facetConfig={facetConfig} />
    </NextIntlClientProvider>
  )
}
