'use client'

import React from 'react'
import {
  BlockEditButton,
  BlockRemoveButton,
  useBlockComponentContext,
} from '@payloadcms/richtext-lexical/client'
import { Pill } from '@payloadcms/ui'
import type { LucideIcon } from 'lucide-react'
import { blockIconMap, defaultBlockIcon } from '../blockIcons'

export const blockDisplayNames: Record<string, string> = {
  content: 'Content',
  mediaBlock: 'Media Block',
  masonryGallery: 'Gallery',
  featureSection: 'Feature Section',
  featureHighlight: 'Feature Highlight',
  banner: 'Banner',
  learnMore: 'Learn More',
  spacerBlock: 'Spacer',
  columns: 'Columns',
  fullWidthCta: 'Full Width CTA',
  cta: 'Call to Action',
  experienceListing: 'Experience Listing',
  pagesBlock: 'Pages Block',
  factsListing: 'Facts Listing',
  iconCards: 'Icon Cards',
  statisticsBanner: 'Statistics Banner',
  stats: 'Stats',
  faqAccordion: 'FAQ Accordion',
  svgMap: 'SVG Map',
  mapExplorer: 'Map Explorer',
  formBlock: 'Form Block',
  archive: 'Archive',
  eventSearch: 'Event Search',
  featuredEvents: 'Featured Events',
}

/**
 * Shared shell for all skeleton preview block components.
 * Renders the BlockCollapsible with the block icon, name, and Edit/Remove buttons,
 * and renders `children` as the skeleton body.
 *
 * @param blockSlug - The block's slug, used to look up the icon and display name
 */
export const BlockPreviewShell: React.FC<{
  blockSlug: string
  children: React.ReactNode
}> = ({ blockSlug, children }) => {
  const { BlockCollapsible } = useBlockComponentContext()

  const Icon: LucideIcon = blockIconMap[blockSlug] || defaultBlockIcon
  const displayName = blockDisplayNames[blockSlug] || blockSlug

  return (
    <BlockCollapsible
      collapsibleProps={{
        isCollapsed: false,
        disableHeaderToggle: true,
        disableToggleIndicator: true,
      }}
      Pill={
        <Pill pillStyle="white" size="small">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Icon size={14} strokeWidth={2} />
            {displayName}
          </span>
        </Pill>
      }
      Actions={
        <>
          <BlockEditButton />
          <BlockRemoveButton />
        </>
      }
    >
      {children}
    </BlockCollapsible>
  )
}
