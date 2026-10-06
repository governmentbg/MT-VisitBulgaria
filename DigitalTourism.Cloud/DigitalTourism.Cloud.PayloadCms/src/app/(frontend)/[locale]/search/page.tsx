import type { Metadata } from 'next/types'
import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale, getMessages, getTranslations } from 'next-intl/server'
import { searchExperiences, getNomenclatureDisplayMap, SORT_TO_TYPESENSE, type ExperienceSearchFilters, type SortOption } from '@/lib/search'
import SearchPageClient from './page.client'
import { getSiteIdentity, getFacetConfig } from '@/utilities/getSettings'
import { formatPageTitle } from '@/utilities/generateMeta'
import type { PayloadLocale } from '@/i18n/localization'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    q?: string
    type?: string
    region?: string
    municipality?: string
    city?: string
    starRating?: string
    cuisineType?: string
    difficultyLevel?: string
    amenities?: string
    dietaryOptions?: string
    seasonality?: string
    minimumAge?: string
    equipmentProvided?: string
    organizer?: string
    page?: string
    sort?: string
  }>
}

export default async function Page({ params, searchParams }: Args) {
  const { locale } = await params
  const {
    q,
    type,
    region,
    municipality,
    city,
    starRating,
    cuisineType,
    difficultyLevel,
    amenities,
    dietaryOptions,
    seasonality,
    minimumAge,
    equipmentProvided,
    organizer,
    page,
    sort,
  } = await searchParams
  setRequestLocale(locale)

  // Build filters from URL params (all use string[] for consistency)
  const filters: ExperienceSearchFilters = {
    type: type ? type.split(',') : undefined,
    region: region ? region.split(',') : undefined,
    municipality: municipality ? municipality.split(',') : undefined,
    city: city ? city.split(',') : undefined,
    starRating: starRating ? starRating.split(',') : undefined,
    cuisineType: cuisineType ? cuisineType.split(',') : undefined,
    difficultyLevel: difficultyLevel ? difficultyLevel.split(',') : undefined,
    amenities: amenities ? amenities.split(',') : undefined,
    dietaryOptions: dietaryOptions ? dietaryOptions.split(',') : undefined,
    seasonality: seasonality ? seasonality.split(',') : undefined,
    organizer: organizer ? organizer.split(',') : undefined,
    minimumAge: minimumAge ? parseInt(minimumAge, 10) : undefined,
    equipmentProvided: equipmentProvided === 'true' ? true : equipmentProvided === 'false' ? false : undefined,
  }

  const sortOption: SortOption = (['relevance', 'title_asc', 'title_desc', 'newest'] as const).includes(sort as SortOption)
    ? (sort as SortOption)
    : 'relevance'

  // Perform initial server-side search and fetch nomenclature display data + facet config in parallel
  const [initialResults, nomenclatureMap, facetConfig, allMessages] = await Promise.all([
    searchExperiences({
      query: q || '*',
      locale,
      page: page ? parseInt(page, 10) : 1,
      filters,
      sortBy: SORT_TO_TYPESENSE[sortOption],
    }),
    getNomenclatureDisplayMap(locale),
    getFacetConfig(),
    getMessages(),
  ])

  return (
    <NextIntlClientProvider messages={{ experienceListing: allMessages.experienceListing, common: allMessages.common }}>
      <SearchPageClient
        locale={locale}
        initialResults={initialResults}
        nomenclatureMap={nomenclatureMap}
        facetConfig={facetConfig}
      />
    </NextIntlClientProvider>
  )
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const { locale } = await params
  const { q } = await searchParams
  const t = await getTranslations({ locale, namespace: 'common' })
  const { siteName } = await getSiteIdentity(locale as PayloadLocale)

  const title = q ? `${t('search')}: ${q}` : t('search')

  return {
    title: formatPageTitle(title, siteName),
  }
}
