import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type MediumImpactHeroProps = Page['hero']

export const MediumImpactHero: React.FC<MediumImpactHeroProps> = ({
  media,
  richText,
  decorativeText,
}) => {
  return (
    <div className="relative -mt-[11rem] flex items-end text-white min-h-[60vh] md:min-h-[70vh]">
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
            preferredSize="og"
            size="100vw"
            mobileMaxSize="medium"
          />
        )}
        {/* Bottom-heavy gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(0,0,0,0) 26%, rgba(0,0,0,0.36) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 90%)',
          }}
        />
      </div>

      {/* Content layer */}
      <div className="container relative z-10 pb-12 md:pb-16 lg:pb-20">
        {/* Page title */}
        {richText && (
          <RichText
            className="max-w-4xl
              [&_h1]:font-heading [&_h1]:font-bold
              [&_h1]:text-[2rem] [&_h1]:leading-tight
              [&_h1]:md:text-[3.5rem]
              [&_h1]:lg:text-[6.25rem] [&_h1]:lg:leading-[1.05]"
            data={richText}
            enableGutter={false}
            enableProse={false}
          />
        )}
      </div>

      {/* Static decorative text — desktop only */}
      {decorativeText && (
        <span
          className="absolute top-32 right-8 z-10 hidden lg:block
                     font-heading text-xs tracking-[0.25em] text-white/30 uppercase"
          style={{ writingMode: 'vertical-rl' }}
          aria-hidden="true"
        >
          {decorativeText}
        </span>
      )}
    </div>
  )
}
