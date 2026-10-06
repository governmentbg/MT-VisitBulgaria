import React from 'react'
import { getLocale } from 'next-intl/server'

import type { Page, Footer as FooterType } from '@/payload-types'
import type { PayloadLocale } from '@/i18n/localization'
import type { BreadcrumbItem } from '@/components/Breadcrumbs'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { getCachedFooter } from '@/utilities/getGlobals'

import { WaveDecoration } from './WaveDecoration'
import { SocialIconsBar } from './SocialIconsBar'

type HighImpactHeroProps = Page['hero'] & {
  breadcrumbs?: BreadcrumbItem[] | null
}

export const HighImpactHero: React.FC<HighImpactHeroProps> = async ({ links, media, richText }) => {
  const locale = (await getLocale()) as PayloadLocale
  const footerData: FooterType = await getCachedFooter(locale)()
  const socialLinks = footerData?.socialLinks || []

  return (
    <div className="relative -mt-[11rem] flex items-end text-white min-h-[85vh] mob-ls:min-h-screen md:min-h-[90vh]">
      {/* Background media */}
      <div className="absolute inset-0 select-none">
        {media && typeof media === 'object' && (
          <Media
            fill
            imgClassName="object-cover"
            videoClassName="absolute inset-0 object-cover w-full h-full"
            priority
            usePayloadSizes
            resource={media}
            preferredSize="large"
            size="100vw"
            mobileMaxSize="medium"
          />
        )}
        <div className="hero-overlay absolute inset-0 pointer-events-none" />
      </div>

      {/* Content layer */}
      <div className="container relative z-10 pb-32 mob-ls:pb-20 md:pb-40 lg:pb-48">
        <div className="flex items-end justify-between gap-8">
          {/* Left: text content */}
          <div className="max-w-5xl">
            {richText && (
              <RichText
                className="mb-6
                  [&_p]:text-lg [&_p]:md:text-xl [&_p]:tracking-tight [&_p]:opacity-80
                  [&_h1]:font-heading [&_h1]:font-bold
                  [&_h1]:text-[2rem] [&_h1]:leading-tight
                  [&_h1]:md:text-[3.5rem]
                  [&_h1]:lg:text-[6.25rem] [&_h1]:lg:leading-[1.05]"
                data={richText}
                enableGutter={false}
                enableProse={false}
              />
            )}
            {Array.isArray(links) && links.length > 0 && (
              <ul className="flex gap-4">
                {links.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right: social icons — landscape + desktop (vertical) */}
          {socialLinks.length > 0 && (
            <SocialIconsBar
              links={socialLinks}
              className="hidden mob-ls:flex md:flex flex-col shrink-0"
            />
          )}
        </div>

        {/* Social icons — mobile portrait (horizontal, below content) */}
        {socialLinks.length > 0 && (
          <SocialIconsBar
            links={socialLinks}
            className="flex mob-ls:hidden md:hidden mt-6"
          />
        )}
      </div>

      {/* Wave decoration at bottom */}
      <WaveDecoration className="absolute bottom-0 left-0 right-0 z-10 translate-y-[1px]" />
    </div>
  )
}
