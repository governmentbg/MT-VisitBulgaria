import { NextResponse } from 'next/server'
import { getCachedMainMenu } from '@/utilities/getGlobals'
import type { PayloadLocale } from '@/i18n/localization'

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const menu = await getCachedMainMenu(locale as PayloadLocale)()
  return NextResponse.json(menu.tabs ?? [], {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
  })
}
