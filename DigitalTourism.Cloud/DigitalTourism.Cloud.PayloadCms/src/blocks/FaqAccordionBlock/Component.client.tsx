'use client'

import React from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import RichText from '@/components/RichText'
import { cn } from '@/components/ui'

import type { FaqAccordionBlock } from '@/payload-types'

type FaqItem = NonNullable<FaqAccordionBlock['items']>[number]

interface FaqAccordionClientProps {
  items: FaqItem[]
  allowMultipleOpen: boolean
}

export const FaqAccordionClient: React.FC<FaqAccordionClientProps> = ({
  items,
  allowMultipleOpen,
}) => {
  if (allowMultipleOpen) {
    return (
      <Accordion.Root type="multiple" className="divide-y divide-grey-100">
        {items.map((item, index) => (
          <AccordionItem key={index} item={item} value={`item-${index}`} />
        ))}
      </Accordion.Root>
    )
  }

  return (
    <Accordion.Root type="single" collapsible className="divide-y divide-grey-100">
      {items.map((item, index) => (
        <AccordionItem key={index} item={item} value={`item-${index}`} />
      ))}
    </Accordion.Root>
  )
}

const AccordionItem: React.FC<{ item: FaqItem; value: string }> = ({ item, value }) => {
  return (
    <Accordion.Item value={value} className="py-4">
      <Accordion.Trigger
        className={cn(
          'group flex w-full items-center justify-between gap-4 py-2 text-left',
          'font-heading text-lg font-semibold text-grey-900 transition-colors hover:text-primary',
        )}
      >
        {item.question}
        <SpriteIcon
          name="chevron-down"
          className="h-5 w-5 shrink-0 text-grey-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </Accordion.Trigger>
      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="pb-2 pt-2">
          {item.answer && (
            <RichText
              data={item.answer}
              enableGutter={false}
              enableProse
              className="text-grey-600"
            />
          )}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  )
}
