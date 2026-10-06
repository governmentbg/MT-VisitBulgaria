import React from 'react'
import { getTrip, getVisitorContext } from '../actions'
import { getPayloadClient } from '@/payload/payloadClient'
import { redirect } from 'next/navigation'
import { TripPlanner } from '../_components/TripPlanner'
import { getSiteIdentity } from '@/utilities/getSettings'
import { formatPageTitle } from '@/utilities/generateMeta'
import type { PayloadLocale } from '@/i18n/localization'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function TripPage({ params }: Args) {
  const { locale, id } = await params
  const ctx = await getVisitorContext()

  if (!ctx) {
    redirect(`/${locale}/login?redirect=%2F${locale}%2Faccount%2Ftrips%2F${id}`)
  }

  const trip = await getTrip(id, locale, ctx)

  if (!trip) {
    redirect(`/${locale}/account/trips`)
  }

  return (
    <TripPlanner
      trip={trip}
      onBackPath={`/${locale}/account/trips`}
      locale={locale}
    />
  )
}

export async function generateMetadata({ params }: Args) {
  const { locale, id } = await params
  const payload = await getPayloadClient()
  const [trip, { siteName }] = await Promise.all([
    payload.findByID({
      collection: 'trips',
      id,
      depth: 0,
      select: { name: true },
    }),
    getSiteIdentity(locale as PayloadLocale),
  ])

  return {
    title: formatPageTitle(trip?.name || 'Trip Planner', siteName),
  }
}
