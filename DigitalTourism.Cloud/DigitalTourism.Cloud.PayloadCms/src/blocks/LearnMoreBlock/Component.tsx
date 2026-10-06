'use client'

import React from 'react'
import type { LearnMoreBlock as LearnMoreBlockProps } from '@/payload-types'
import { Section, Container } from '@/components/ui'
import { SectionHeader } from '@/components/SectionHeader'
import { HorizontalAccordion, type HorizontalAccordionItem } from '@/components/HorizontalAccordion'
import type { Media as MediaType } from '@/payload-types'

export const LearnMoreBlockComponent: React.FC<LearnMoreBlockProps> = ({
  heading,
  description,
  items,
}) => {
  if (!items || items.length === 0) return null

  const accordionItems: HorizontalAccordionItem[] = items.map((item, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: item.title,
    body: item.body ?? undefined,
    image: (item.image as MediaType) ?? undefined,
  }))

  return (
    <Section>
      <Container>
        {heading && (
          <SectionHeader heading={heading} description={description} alignment="center" />
        )}
        <HorizontalAccordion items={accordionItems} />
      </Container>
    </Section>
  )
}
