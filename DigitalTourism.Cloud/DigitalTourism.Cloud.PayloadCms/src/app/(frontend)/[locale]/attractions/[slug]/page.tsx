import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'
import { draftMode } from 'next/headers'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { PayloadLocale } from '@/i18n/localization'

import { getAttractionDetails, getExperienceMetaDoc } from '@/lib/payloadData/server'
import { TYPE_TO_SLUG, type ExperienceType } from '@/collections/Experiences/constants'
import { Pill } from '@/components/ui'

const EXPERIENCE_TYPE: ExperienceType = 'attraction'
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
  const url = '/attractions/' + decodedSlug
  const experience = await getAttractionDetails({
    slug: decodedSlug,
    locale,
    draft,
  })

  if (!experience) return <PayloadRedirects url={url} />

  const alternateUrls = await getAlternateUrls({ collection: COLLECTION_SLUG, id: experience.id, collectionPrefix: 'attractions' })

  return (
    <ExperienceDetailLayout
      experience={experience}
      experienceType={EXPERIENCE_TYPE}
      locale={locale}
      url={url}
      draft={draft}
      pageClient={<><PageClient /><AlternateUrlsClient urls={alternateUrls} /></>}
      typeSpecificContent={
        <AttractionSpecificDetails experience={experience} t={t} />
      }
    />
  )
}

function AttractionSpecificDetails({
  experience,
  t,
}: {
  experience: NonNullable<Awaited<ReturnType<typeof getAttractionDetails>>>
  t: Awaited<ReturnType<typeof getTranslations<'experiences'>>>
}) {
  const hasDetails =
    experience.visitDuration ||
    experience.attractionHours

  if (!hasDetails) return null

  return (
    <div className="my-8">
      <div className="flex flex-wrap gap-2">
        {experience.visitDuration && (
          <Pill variant="default" size="md">
            {t('attraction.visitDuration')}: {experience.visitDuration} {t('attraction.minutes')}
          </Pill>
        )}
        {experience.attractionHours && (
          <Pill variant="default" size="md">
            {t('attraction.hours')}: {experience.attractionHours}
          </Pill>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale, slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const doc = await getExperienceMetaDoc({ collection: COLLECTION_SLUG, slug: decodedSlug, locale })

  const alternateUrls = doc?.id
    ? await getAlternateUrls({ collection: COLLECTION_SLUG, id: doc.id as number, collectionPrefix: 'attractions' })
    : undefined

  return generateMeta({ doc, collectionSlug: COLLECTION_SLUG, locale, alternateUrls })
}
