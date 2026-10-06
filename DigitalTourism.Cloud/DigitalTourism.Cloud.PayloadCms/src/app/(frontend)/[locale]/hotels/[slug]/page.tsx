import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'
import { draftMode } from 'next/headers'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { PayloadLocale } from '@/i18n/localization'

import { getHotelDetails, getExperienceMetaDoc } from '@/lib/payloadData/server'
import { TYPE_TO_SLUG, type ExperienceType } from '@/collections/Experiences/constants'
import { NomenclatureBadge } from '@/components/NomenclatureBadge'
import { Pill } from '@/components/ui'

const EXPERIENCE_TYPE: ExperienceType = 'hotel'
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
  const url = '/hotels/' + decodedSlug
  const experience = await getHotelDetails({
    slug: decodedSlug,
    locale,
    draft,
  })

  if (!experience) return <PayloadRedirects url={url} />

  const alternateUrls = await getAlternateUrls({ collection: COLLECTION_SLUG, id: experience.id, collectionPrefix: 'hotels' })

  return (
    <ExperienceDetailLayout
      experience={experience}
      experienceType={EXPERIENCE_TYPE}
      locale={locale}
      url={url}
      draft={draft}
      pageClient={<><PageClient /><AlternateUrlsClient urls={alternateUrls} /></>}
      typeSpecificContent={
        <HotelSpecificDetails experience={experience} t={t} />
      }
      starRating={experience.starRating ? parseInt(experience.starRating) : null}
    />
  )
}

function HotelSpecificDetails({
  experience,
  t,
}: {
  experience: NonNullable<Awaited<ReturnType<typeof getHotelDetails>>>
  t: Awaited<ReturnType<typeof getTranslations<'experiences'>>>
}) {
  const hasDetails =
    experience.starRating ||
    experience.rooms ||
    experience.checkInTime ||
    experience.checkOutTime ||
    (experience.amenities && experience.amenities.length > 0)

  if (!hasDetails) return null

  return (
    <div className="my-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        {experience.rooms && (
          <Pill variant="default" size="md">
            {t('hotel.rooms')}: {experience.rooms}
          </Pill>
        )}
        {experience.checkInTime && (
          <Pill variant="default" size="md">
            {t('hotel.checkIn')}: {experience.checkInTime}
          </Pill>
        )}
        {experience.checkOutTime && (
          <Pill variant="default" size="md">
            {t('hotel.checkOut')}: {experience.checkOutTime}
          </Pill>
        )}
      </div>

      {experience.amenities && experience.amenities.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-grey-500">{t('hotel.amenities')}</p>
          <div className="flex flex-wrap gap-2">
            {experience.amenities.map((amenity) => (
              <NomenclatureBadge key={typeof amenity === 'object' ? amenity.id : amenity} item={amenity} />
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
    ? await getAlternateUrls({ collection: COLLECTION_SLUG, id: doc.id as number, collectionPrefix: 'hotels' })
    : undefined

  return generateMeta({ doc, collectionSlug: COLLECTION_SLUG, locale, alternateUrls })
}
