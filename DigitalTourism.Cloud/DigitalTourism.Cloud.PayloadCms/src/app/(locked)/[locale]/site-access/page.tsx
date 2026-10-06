import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Setting } from '@/payload-types'
import { SiteAccessForm } from './SiteAccessForm'

export const metadata: Metadata = {
  title: 'Site Access',
  robots: { index: false, follow: false },
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ returnTo?: string }>
}

export default async function SiteAccessPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { returnTo } = await searchParams

  const settings = (await getCachedGlobal('settings', 0)()) as Setting

  if (!settings.sitePasswordEnabled || !settings.sitePasswordHash) {
    redirect(`/${locale}`)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'Montserrat, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {locale === 'bg' ? 'Достъп до сайта' : 'Site Access'}
        </h1>
        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {locale === 'bg'
            ? 'Моля, въведете паролата за достъп до сайта.'
            : 'Please enter the password to access this site.'}
        </p>
        <SiteAccessForm locale={locale} returnTo={returnTo || `/${locale}`} />
      </div>
    </div>
  )
}
