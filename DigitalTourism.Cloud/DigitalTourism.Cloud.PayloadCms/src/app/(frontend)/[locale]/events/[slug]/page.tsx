import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'
import { draftMode } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import type { PayloadLocale } from '@/i18n/localization'

import { getEventDetails, getExperienceMetaDoc } from '@/lib/payloadData/server'
import { TYPE_TO_SLUG } from '@/collections/Experiences/constants'
import { generateMeta } from '@/utilities/generateMeta'
import { EventDetailLayout } from '@/components/EventDetails'
import PageClient from './page.client'
import { AlternateUrlsClient } from '@/components/AlternateUrlsClient'
import { getAlternateUrls } from '@/utilities/getAlternateUrls'

const COLLECTION_SLUG = TYPE_TO_SLUG['event']

export async function generateStaticParams() {
  return []
}

type Args = {
  params: Promise<{
    locale: PayloadLocale
    slug?: string
  }>
}

export default async function EventPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale, slug = '' } = await paramsPromise
  setRequestLocale(locale)

  const decodedSlug = decodeURIComponent(slug)
  const url = '/events/' + decodedSlug
  const experience = await getEventDetails({
    slug: decodedSlug,
    locale,
    draft,
  })

  if (!experience) return <PayloadRedirects url={url} />

  const alternateUrls = await getAlternateUrls({ collection: COLLECTION_SLUG, id: experience.id, collectionPrefix: 'events' })

  return (
    <EventDetailLayout
      experience={experience}
      locale={locale}
      url={url}
      draft={draft}
      pageClient={<><PageClient /><AlternateUrlsClient urls={alternateUrls} /></>}
    />
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale, slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const doc = await getExperienceMetaDoc({ collection: COLLECTION_SLUG, slug: decodedSlug, locale })

  const alternateUrls = doc?.id
    ? await getAlternateUrls({ collection: COLLECTION_SLUG, id: doc.id as number, collectionPrefix: 'events' })
    : undefined

  return generateMeta({ doc, collectionSlug: COLLECTION_SLUG, locale, alternateUrls })
}
