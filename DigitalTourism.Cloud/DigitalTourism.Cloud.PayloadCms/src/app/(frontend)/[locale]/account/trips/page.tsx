import React from 'react'
import { getTranslations } from 'next-intl/server'
import { getMyTrips, getVisitorContext } from './actions'
import PlanYourTripClient from './page.client'
import { getSiteIdentity } from '@/utilities/getSettings'
import { formatPageTitle } from '@/utilities/generateMeta'
import type { PayloadLocale } from '@/i18n/localization'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale: string
  }>
}

export default async function PlanYourTripPage({ params }: Args) {
  const { locale } = await params
  const ctx = await getVisitorContext()

  const trips = await getMyTrips(locale, ctx, { depth: 0 })
  // Serialize trips to plain JSON if needed, but Next.js handles simple objects.
  // Payload docs might have dates/recursion that need json stringify/parse or careful passing.
  // Docs seem to be serializable usually.

  return (
    <div className="min-h-screen bg-grey-25">
      <div className="container py-10">
        <PlanYourTripClient
          locale={locale}
          initialTrips={trips}
        />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Args) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const { siteName } = await getSiteIdentity(locale as PayloadLocale)

  return {
    title: formatPageTitle(t('planYourTrip') || 'Plan Your Trip', siteName),
  }
}
