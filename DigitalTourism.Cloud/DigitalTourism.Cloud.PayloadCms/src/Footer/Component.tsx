import { getCachedFooter } from '@/utilities/getGlobals'
import { Link } from '@/i18n/routing'
import { getLocale, getTranslations } from 'next-intl/server'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'
import type { PayloadLocale } from '@/i18n/localization'

import { Container } from '@/components/ui'
import { Logo } from '@/components/Logo/Logo'
import { FooterNewsletter } from './FooterNewsletter'
import { FooterLinkGroup } from './FooterLinkGroup'
import { FooterSocials } from './FooterSocials'
import { FooterCredits } from './FooterCredits'
import { getSiteIdentity } from '@/utilities/getSettings'

export async function Footer() {
  const locale = (await getLocale()) as PayloadLocale
  const footerData: FooterType = await getCachedFooter(locale)()
  const t = await getTranslations('footer')
  const { siteName } = await getSiteIdentity(locale)

  const linkGroups = footerData?.linkGroups || []
  const socialLinks = footerData?.socialLinks || []
  const headline = footerData?.newsletterHeadline || t('headline')
  const subtitle = footerData?.newsletterSubtitle || t('subtitle')

  return (
    <footer className="relative z-10 mt-auto bg-footer-bg text-white">
      <Container className="py-16 md:py-20">
        {/* Top: branding + newsletter | link columns */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left section */}
          <div className="flex flex-col gap-8 max-w-[35rem]">
            <Link href="/" aria-label={t('homeLink')}>
              <Logo variant="light" />
            </Link>

            <div className="flex flex-col gap-6">
              <h2 className="font-heading font-bold text-3xl md:text-[3rem] md:leading-[1.2] text-white">
                {headline}
              </h2>
              <p className="font-sans font-bold text-lg text-white">
                {subtitle}
              </p>
            </div>

            <FooterNewsletter />
          </div>

          {/* Right section: link columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:pt-4">
            {linkGroups.map((group, i) => (
              <FooterLinkGroup
                key={group.id || i}
                title={group.title}
                links={group.links || []}
              />
            ))}
            {socialLinks.length > 0 && (
              <FooterSocials title={t('followUs')} links={socialLinks} />
            )}
          </div>
        </div>

        {/* Bottom: divider + copyright */}
        <FooterCredits
          className="mt-16"
          copyrightText={`\u00A9 ${new Date().getFullYear()} ${siteName}. ${t('copyright')}.`}
        />
      </Container>
    </footer>
  )
}
