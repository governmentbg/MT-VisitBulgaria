import React from 'react'

import type { FaqAccordionBlock as FaqAccordionBlockProps } from '@/payload-types'

import { Section, Container } from '@/components/ui'
import { FaqAccordionClient } from './Component.client'

export const FaqAccordionBlockComponent: React.FC<FaqAccordionBlockProps> = ({
  heading,
  description,
  items,
  allowMultipleOpen,
  fullWidth,
}) => {
  if (!items?.length) return null

  return (
    <Section>
      <Container>
        <div className={fullWidth ? 'mx-auto' : 'mx-auto max-w-3xl'}>
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-grey-900 md:text-3xl lg:text-4xl">
              {heading}
            </h2>
            {description && (
              <p className="mt-3 text-base text-grey-500">{description}</p>
            )}
          </div>
          <FaqAccordionClient
            items={items}
            allowMultipleOpen={allowMultipleOpen ?? false}
          />
        </div>
      </Container>
    </Section>
  )
}
