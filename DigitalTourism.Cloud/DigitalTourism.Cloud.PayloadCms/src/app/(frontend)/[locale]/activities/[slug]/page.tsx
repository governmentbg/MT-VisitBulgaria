import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'
import { draftMode } from 'next/headers'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { PayloadLocale } from '@/i18n/localization'

import { TYPE_TO_SLUG, type ExperienceType } from '@/collections/Experiences/constants'
import { NomenclatureBadge } from '@/components/NomenclatureBadge'
import { Pill } from '@/components/ui'
import { getActivityDetails, getExperienceMetaDoc } from '@/lib/payloadData/server'

const EXPERIENCE_TYPE: ExperienceType = 'activity'
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
  const url = '/activities/' + decodedSlug
  const experience = await getActivityDetails({
    slug: decodedSlug,
    locale,
    draft,
  })

  if (!experience) return <PayloadRedirects url={url} />

  const alternateUrls = await getAlternateUrls({ collection: COLLECTION_SLUG, id: experience.id, collectionPrefix: 'activities' })

  return (
    <ExperienceDetailLayout
      experience={experience}
      experienceType={EXPERIENCE_TYPE}
      locale={locale}
      url={url}
      draft={draft}
      pageClient={<><PageClient /><AlternateUrlsClient urls={alternateUrls} /></>}
      typeSpecificContent={
        <ActivitySpecificDetails experience={experience} t={t} />
      }
    />
  )
}

function ActivitySpecificDetails({
  experience,
  t,
}: {
  experience: NonNullable<Awaited<ReturnType<typeof getActivityDetails>>>
  t: Awaited<ReturnType<typeof getTranslations<'experiences'>>>
}) {
  const hasDetails =
    experience.duration ||
    experience.difficultyLevel ||
    experience.minimumAge ||
    (experience.groupSize && (experience.groupSize.min || experience.groupSize.max)) ||
    (experience.seasonality && experience.seasonality.length > 0) ||
    experience.equipmentProvided !== undefined

  if (!hasDetails) return null

  return (
    <div className="my-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        {experience.duration && (
          <Pill variant="default" size="md">
            {t('activity.duration')}: {experience.duration}
          </Pill>
        )}
        {experience.difficultyLevel && (
          <NomenclatureBadge item={experience.difficultyLevel} />
        )}
        {experience.minimumAge && (
          <Pill variant="default" size="md">
            {t('activity.minAge')}: {experience.minimumAge}+
          </Pill>
        )}
        {experience.groupSize && (experience.groupSize.min || experience.groupSize.max) && (
          <Pill variant="default" size="md">
            {t('activity.groupSize')}:{' '}
            {experience.groupSize.min && experience.groupSize.max
              ? `${experience.groupSize.min} - ${experience.groupSize.max}`
              : experience.groupSize.min || experience.groupSize.max}
          </Pill>
        )}
        {experience.equipmentProvided !== undefined && experience.equipmentProvided !== null && (
          <Pill variant="default" size="md">
            {t('activity.equipmentProvided')}: {experience.equipmentProvided ? '✓' : '✗'}
          </Pill>
        )}
      </div>

      {experience.seasonality && experience.seasonality.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-grey-500">{t('activity.season')}</p>
          <div className="flex flex-wrap gap-2">
            {experience.seasonality.map((season) => (
              <NomenclatureBadge key={typeof season === 'object' ? season.id : season} item={season} />
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
    ? await getAlternateUrls({ collection: COLLECTION_SLUG, id: doc.id as number, collectionPrefix: 'activities' })
    : undefined

  return generateMeta({ doc, collectionSlug: COLLECTION_SLUG, locale, alternateUrls })
}
