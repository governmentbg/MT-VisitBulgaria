import React, { Suspense } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { getPayloadClient } from '@/payload/payloadClient'
import type { Payload } from 'payload'
import type { ExperienceListingBlockData, DisplayMode } from '../../types'
import {
  searchExperiences,
  SORT_TO_TYPESENSE,
  getNomenclatureDisplayMap,
  type SortOption,
  type ExperienceSearchResponse,
} from '@/lib/search'
import { getFacetConfig } from '@/utilities/getSettings'
import { ExperienceListingClient } from './Component.client'

type Props = ExperienceListingBlockData & {
  disableInnerContainer?: boolean
}

async function resolveRelationshipField(
  payload: Payload,
  ids: (number | { id: number })[] | undefined,
  collection: 'categories' | 'tags' | 'regions' | 'municipalities' | 'cities',
  field: 'title' | 'name',
  locale: string,
): Promise<string[]> {
  const numericIds = ids
    ?.map((item) => (typeof item === 'object' ? item.id : item))
    .filter((id): id is number => typeof id === 'number')
  if (!numericIds?.length) return []
  const result = await payload.find({
    collection,
    where: { id: { in: numericIds } },
    locale: locale as 'en' | 'bg' | 'de' | 'fr' | 'ru',
    depth: 0,
    limit: numericIds.length,
  })
  return result.docs
    .map((d) => (d as unknown as Record<string, string>)[field])
    .filter((v): v is string => !!v)
}

export const ExperienceListingBlockComponent: React.FC<Props> = async (props) => {
  const {
    id,
    displayMode = 'grid',
    heading,
    description,
    sectionLabel,
    headerAlignment,
    viewAllLink,
    sectionVariant,
    showMonthFilter = false,
    isFocused = false,
    decorationImage,
    decorationAlignment,
    backgroundShape,
    overlayCardStyle,
    overlayLayout,
    defaultType,
    defaultCategories,
    defaultTags,
    defaultRegion,
    defaultMunicipality,
    defaultCity,
    itemsPerPage = 8,
    defaultSort = 'relevance',
    showAdvancedSearch = false,
    showSearchInput = false,
    showFilters = true,
  } = props

  const locale = await getLocale()
  const payload = await getPayloadClient()
  const t = await getTranslations('experienceListing')
  const allMessages = await getMessages()
  const scopedMessages = { experienceListing: allMessages.experienceListing, common: allMessages.common }

  // Resolve relationship IDs to display strings for Typesense filters
  const categoryTitles = await resolveRelationshipField(
    payload,
    defaultCategories,
    'categories',
    'title',
    locale,
  )
  const tagTitles = await resolveRelationshipField(payload, defaultTags, 'tags', 'title', locale)
  const regionDefaults = await resolveRelationshipField(
    payload,
    defaultRegion,
    'regions',
    'name',
    locale,
  )
  const municipalityDefaults = await resolveRelationshipField(
    payload,
    defaultMunicipality,
    'municipalities',
    'name',
    locale,
  )
  const cityDefaults = await resolveRelationshipField(
    payload,
    defaultCity,
    'cities',
    'name',
    locale,
  )

  const typeDefaults = defaultType?.length ? defaultType : undefined

  // For carousel modes, fetch enough items to fill the carousel
  const isCarousel = displayMode !== 'grid'
  const perPage = itemsPerPage

  // Fetch nomenclature display data for filter labels/icons and facet config (grid mode only)
  const nomenclatureMap = !isCarousel && showFilters ? await getNomenclatureDisplayMap(locale) : {}
  const facetConfig = !isCarousel && showFilters ? await getFacetConfig() : undefined

  // When showMonthFilter is enabled, filter for upcoming events
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const initialResults = await searchExperiences({
    query: '*',
    locale,
    page: 1,
    perPage,
    filters: {
      type: showMonthFilter ? ['event'] : typeDefaults,
      categories: categoryTitles.length > 0 ? categoryTitles : undefined,
      tags: tagTitles.length > 0 ? tagTitles : undefined,
      region: regionDefaults.length > 0 ? regionDefaults : undefined,
      municipality: municipalityDefaults.length > 0 ? municipalityDefaults : undefined,
      city: cityDefaults.length > 0 ? cityDefaults : undefined,
      ...(showMonthFilter && {
        dateEndAfter: now.getTime(),
        dateFrom: thisMonthStart.getTime(),
        dateTo: thisMonthEnd.getTime(),
      }),
    },
    sortBy: showMonthFilter ? 'period.startDate:asc' : SORT_TO_TYPESENSE[defaultSort as SortOption],
  })

  // Trim fields not needed for card rendering to reduce RSC payload size
  const trimmedResults: ExperienceSearchResponse = {
    ...initialResults,
    facets: isCarousel ? undefined : initialResults.facets,
    hits: initialResults.hits.map(
      ({
        id,
        title,
        slug,
        type,
        description,
        heroImage,
        starRating,
        rating,
        priceLevel,
        date,
        categories,
        location,
      }) => ({
        id,
        title,
        slug,
        type,
        description,
        heroImage: heroImage ? { url: heroImage.url, alt: heroImage.alt } : undefined,
        starRating,
        rating,
        priceLevel,
        date,
        categories: categories?.slice(0, 1),
        location: location ? { city: location.city, region: location.region } : undefined,
      }),
    ),
  }
  const client = (
    <ExperienceListingClient
      blockId={id ?? ''}
      locale={locale}
      initialResults={trimmedResults}
      defaults={{
        type: typeDefaults,
        categories: categoryTitles,
        tags: tagTitles,
        region: regionDefaults,
        municipality: municipalityDefaults,
        city: cityDefaults,
        sort: defaultSort as SortOption,
      }}
      itemsPerPage={itemsPerPage}
      gridColumns={3}
      paginationMode="pagination"
      showAdvancedSearch={showAdvancedSearch}
      showSearchInput={showSearchInput}
      showFilters={showFilters}
      displayMode={displayMode as DisplayMode}
      heading={heading}
      description={description}
      sectionLabel={sectionLabel}
      headerAlignment={headerAlignment}
      viewAllLink={
        viewAllLink
          ? {
              ...viewAllLink,
              label: viewAllLink.label || t('viewAll'),
            }
          : undefined
      }
      sectionVariant={sectionVariant}
      showMonthFilter={showMonthFilter}
      isFocused={isFocused}
      decorationImage={decorationImage}
      decorationAlignment={decorationAlignment}
      backgroundShape={backgroundShape}
      overlayCardStyle={overlayCardStyle}
      overlayLayout={overlayLayout}
      nomenclatureMap={nomenclatureMap}
      facetConfig={facetConfig}
    />
  )

  return (
    <div id={`block-${id}`} className="relative z-[1]">
      <NextIntlClientProvider messages={scopedMessages}>
        {displayMode === 'grid' ? <Suspense>{client}</Suspense> : client}
      </NextIntlClientProvider>
    </div>
  )
}
