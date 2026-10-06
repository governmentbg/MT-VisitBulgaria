import type { Metadata } from 'next/types'
import React, { Suspense } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { PayloadLocale } from '@/i18n/localization'
import { getInitialSearchData } from '@/lib/search'
import { ExperienceListingClient } from '@/plugins/experience-listing/blocks/ExperienceListing/Component.client'
import { getSiteIdentity } from '@/utilities/getSettings'
import { formatPageTitle } from '@/utilities/generateMeta'

export const revalidate = 600

const TYPE_FILTER = ['restaurant']
const ITEMS_PER_PAGE = 12

type Args = {
  params: Promise<{
    locale: PayloadLocale
  }>
}

export default async function Page({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('experiences')
  const { initialResults, nomenclatureMap, facetConfig } = await getInitialSearchData({
    locale,
    perPage: ITEMS_PER_PAGE,
    filters: { type: TYPE_FILTER },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-8">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{t('restaurants')}</h1>
        </div>
      </div>

      <Suspense>
        <ExperienceListingClient
          blockId="restaurants-archive"
          locale={locale}
          initialResults={initialResults}
          defaults={{ type: TYPE_FILTER, sort: 'relevance' }}
          itemsPerPage={ITEMS_PER_PAGE}
          gridColumns={3}
          paginationMode="pagination"
          showAdvancedSearch={true}
          showSearchInput={false}
          showFilters={true}
          displayMode="grid"
          nomenclatureMap={nomenclatureMap}
          facetConfig={facetConfig}
        />
      </Suspense>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experiences' })
  const { siteName } = await getSiteIdentity(locale)

  return {
    title: formatPageTitle(t('restaurants'), siteName),
  }
}

export async function generateStaticParams() {
  return []
}
