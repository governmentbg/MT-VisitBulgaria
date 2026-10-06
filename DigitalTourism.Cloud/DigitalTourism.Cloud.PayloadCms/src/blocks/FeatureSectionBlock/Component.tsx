import React from 'react'

import type { FeatureSectionBlock as FeatureSectionBlockProps } from '@/payload-types'

import { cn, Section, Container } from '@/components/ui'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const FeatureSectionBlockComponent: React.FC<FeatureSectionBlockProps> = ({
  heading,
  description,
  links,
  image,
  imagePosition = 'right',
  showDecoration,
}) => {
  const textContent = (
    <div className="flex flex-col justify-center gap-6">
      <h2 className="font-heading text-2xl font-bold text-grey-900 md:text-3xl lg:text-4xl">
        {heading}
      </h2>
      {description && (
        <RichText
          data={description}
          enableGutter={false}
          enableProse
          className="text-grey-600"
        />
      )}
      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {links.map(({ link }: NonNullable<FeatureSectionBlockProps['links']>[number], i: number) => (
            <CMSLink key={i} size="md" {...link} />
          ))}
        </div>
      )}
    </div>
  )

  const imageContent = (
    <div className="relative overflow-hidden rounded-2xl">
      <Media
        resource={image}
        usePayloadSizes
        preferredSize="medium"
        imgClassName="w-full h-full object-cover"
        className="aspect-square md:aspect-[4/3]"
      />
    </div>
  )

  return (
    <Section padding="lg" className={cn(showDecoration && 'relative')}>
      {showDecoration && (
        <div className="pointer-events-none absolute inset-0 opacity-5">
          {/* Decorative background placeholder */}
          <div className="h-full w-full bg-[url('/images/map-decoration.svg')] bg-center bg-no-repeat" />
        </div>
      )}
      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {imagePosition === 'left' ? (
            <>
              {imageContent}
              {textContent}
            </>
          ) : (
            <>
              {textContent}
              {imageContent}
            </>
          )}
        </div>
      </Container>
    </Section>
  )
}
