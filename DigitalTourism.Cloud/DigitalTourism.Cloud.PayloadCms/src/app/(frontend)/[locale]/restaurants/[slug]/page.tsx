import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'
import { draftMode } from 'next/headers'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { PayloadLocale } from '@/i18n/localization'

import { getRestaurantDetails, getExperienceMetaDoc } from '@/lib/payloadData/server'
import { TYPE_TO_SLUG, type ExperienceType } from '@/collections/Experiences/constants'
import { NomenclatureBadge } from '@/components/NomenclatureBadge'
import { Pill } from '@/components/ui'

const EXPERIENCE_TYPE: ExperienceType = 'restaurant'
const COLLECTION_SLUG = TYPE_TO_SLUG[EXPERIENCE_TYPE]

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { ExperienceDetailLayout } from '@/components/ExperienceDetails'
import { AlternateUrlsClient } from '@/components/AlternateUrlsClient'
import { getAlternateUrls } from '@/utilities/getAlternateUrls'

export async function generateStaticParams() {
  return []
}

type Args = {
  params: Promise<{
    locale: PayloadLocale
    slug?: string
  }>
}

export default async function ExperiencePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale, slug = '' } = await paramsPromise
  setRequestLocale(locale)

  const t = await getTranslations('experiences')
  const decodedSlug = decodeURIComponent(slug)
  const url = '/restaurants/' + decodedSlug
  const experience = await getRestaurantDetails({
    slug: decodedSlug,
    locale,
    draft,
  })

  if (!experience) return <PayloadRedirects url={url} />

  const alternateUrls = await getAlternateUrls({ collection: COLLECTION_SLUG, id: experience.id, collectionPrefix: 'restaurants' })

  return (
    <ExperienceDetailLayout
      experience={experience}
      experienceType={EXPERIENCE_TYPE}
      locale={locale}
      url={url}
      draft={draft}
      pageClient={<><PageClient /><AlternateUrlsClient urls={alternateUrls} /></>}
      typeSpecificContent={
        <RestaurantSpecificDetails experience={experience} t={t} />
      }
    />
  )
}

function RestaurantSpecificDetails({
  experience,
  t,
}: {
  experience: NonNullable<Awaited<ReturnType<typeof getRestaurantDetails>>>
  t: Awaited<ReturnType<typeof getTranslations<'experiences'>>>
}) {
  const hasDetails =
    (experience.cuisineType && experience.cuisineType.length > 0) ||
    (experience.dietaryOptions && experience.dietaryOptions.length > 0) ||
    (experience.restaurantHours && experience.restaurantHours.length > 0)

  if (!hasDetails) return null

  return (
    <div className="my-8 space-y-6">
      {experience.cuisineType && experience.cuisineType.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-grey-500">{t('restaurant.cuisine')}</p>
          <div className="flex flex-wrap gap-2">
            {experience.cuisineType.map((ct) => (
              <NomenclatureBadge key={typeof ct === 'object' ? ct.id : ct} item={ct} />
            ))}
          </div>
        </div>
      )}

      {experience.dietaryOptions && experience.dietaryOptions.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-grey-500">{t('restaurant.dietaryOptions')}</p>
          <div className="flex flex-wrap gap-2">
            {experience.dietaryOptions.map((opt) => (
              <NomenclatureBadge key={typeof opt === 'object' ? opt.id : opt} item={opt} />
            ))}
          </div>
        </div>
      )}

      {experience.restaurantHours && experience.restaurantHours.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-grey-500">{t('restaurant.hours')}</p>
          <div className="flex flex-wrap gap-2">
            {experience.restaurantHours.map((hours, index) => (
              <Pill key={index} variant="default" size="md">
                {hours.days?.join(', ')}: {hours.openTime} - {hours.closeTime}
              </Pill>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale, slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const doc = await getExperienceMetaDoc({ collection: COLLECTION_SLUG, slug: decodedSlug, locale })

  const alternateUrls = doc?.id
    ? await getAlternateUrls({ collection: COLLECTION_SLUG, id: doc.id as number, collectionPrefix: 'restaurants' })
    : undefined

  return generateMeta({ doc, collectionSlug: COLLECTION_SLUG, locale, alternateUrls })
}
