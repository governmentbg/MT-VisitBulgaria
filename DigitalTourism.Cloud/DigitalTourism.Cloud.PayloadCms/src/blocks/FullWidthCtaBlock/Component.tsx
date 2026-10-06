import React from 'react'

import type { FullWidthCtaBlock as FullWidthCtaBlockProps } from '@/payload-types'

import { cn, Container } from '@/components/ui'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

const overlayClasses = {
  light: 'bg-black/30',
  medium: 'bg-black/50',
  heavy: 'bg-black/70',
} as const

const heightClasses = {
  sm: 'min-h-[50svh] md:min-h-[25rem]',
  md: 'min-h-[60svh] md:min-h-[31.25rem]',
  lg: 'min-h-[70svh] md:min-h-[37.5rem]',
} as const

export const FullWidthCtaBlockComponent: React.FC<FullWidthCtaBlockProps> = ({
  heading,
  description,
  links,
  backgroundImage,
  overlayOpacity = 'medium',
  textAlignment = 'center',
  minHeight = 'md',
}) => {
  return (
    <div
      className={cn(
        'relative flex items-center overflow-hidden',
        heightClasses[minHeight as keyof typeof heightClasses],
      )}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Media
          resource={backgroundImage}
          fill
          usePayloadSizes
          preferredSize="large"
          imgClassName="h-full w-full object-cover"
        />
        <div
          className={cn(
            'absolute inset-0',
            overlayClasses[overlayOpacity as keyof typeof overlayClasses],
          )}
        />
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div
          className={cn(
            'flex flex-col gap-6 py-16',
            textAlignment === 'center' && 'items-center text-center',
            textAlignment === 'left' && 'items-start text-left',
          )}
        >
          <h2 className="max-w-3xl font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {heading}
          </h2>
          {description && (
            <div className="max-w-2xl">
              <RichText
                data={description}
                enableGutter={false}
                enableProse={false}
                className="text-white/90"
              />
            </div>
          )}
          {links && links.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-4">
              {links.map(({ link }: NonNullable<FullWidthCtaBlockProps['links']>[number], i: number) => (
                <CMSLink key={i} size="lg" {...link} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
