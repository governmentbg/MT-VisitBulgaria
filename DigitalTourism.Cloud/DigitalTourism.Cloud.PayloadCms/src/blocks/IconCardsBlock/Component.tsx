import React from 'react'

import type { IconCardsBlock as IconCardsBlockProps } from '@/payload-types'

import { cn, Section, Container } from '@/components/ui'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ArrowRightRegular } from '@/components/ui/icons'

const colClasses = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-2 md:grid-cols-4',
} as const

export const IconCardsBlockComponent: React.FC<IconCardsBlockProps> = ({
  heading,
  items,
  columns = '4',
}) => {
  if (!items?.length) return null

  return (
    <Section>
      <Container>
        {heading && (
          <h2 className="mb-10 text-center font-heading text-2xl font-bold text-grey-900 md:text-3xl lg:text-4xl">
            {heading}
          </h2>
        )}
        <div className={cn('grid gap-6 md:gap-8', colClasses[columns as keyof typeof colClasses])}>
          {items.map((item: NonNullable<IconCardsBlockProps['items']>[number], index: number) => {
            const hasLink = item.link?.type === 'reference' ? !!item.link.reference : !!item.link?.url
            const mediaResource = item.image || item.icon

            const card = (
              <div
                key={index}
                className="group flex flex-col items-center gap-4 rounded-2xl p-6 text-center transition-colors hover:bg-grey-25"
              >
                {mediaResource && (
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-50">
                    <Media
                      resource={mediaResource}
                      usePayloadSizes
                      preferredSize="thumbnail"
                      className="h-12 w-12 object-contain"
                      imgClassName="h-12 w-12 object-contain"
                    />
                  </div>
                )}
                <h3 className="font-heading text-lg font-bold text-grey-900">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-grey-500">{item.description}</p>
                )}
                {hasLink && (
                  <ArrowRightRegular className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                )}
              </div>
            )

            if (hasLink) {
              return (
                <CMSLink
                  key={index}
                  {...item.link}
                  appearance="inline"
                  className="no-underline"
                >
                  {card}
                </CMSLink>
              )
            }

            return card
          })}
        </div>
      </Container>
    </Section>
  )
}
