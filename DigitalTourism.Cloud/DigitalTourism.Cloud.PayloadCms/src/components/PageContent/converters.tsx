/**
 * Shared block converters for Lexical richText rendering.
 * Extracted from PageContent to allow reuse (e.g. inside ColumnsBlock)
 * without circular dependencies.
 *
 * Heavy client blocks are lazy-loaded via next/dynamic so their JS is
 * code-split and only shipped to pages that actually render them.
 */
import React from 'react'
import dynamic from 'next/dynamic'
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'

// ── Lightweight / server-only blocks — static imports are fine ──
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { IconCardsBlockComponent } from '@/blocks/IconCardsBlock/Component'
import { StatisticsBannerBlockComponent } from '@/blocks/StatisticsBannerBlock/Component'
import { FullWidthCtaBlockComponent } from '@/blocks/FullWidthCtaBlock/Component'
import { PagesBlockComponent } from '@/blocks/PagesBlock/Component'
import { FeatureSectionBlockComponent } from '@/blocks/FeatureSectionBlock/Component'
import { FeaturedEventsBlockComponent } from '@/blocks/FeaturedEventsBlock/Component'
import { FactsListingBlockComponent } from '@/blocks/FactsListingBlock/Component'
import { SpacerBlockComponent } from '@/blocks/SpacerBlock/Component'
import { StatsBlockComponent } from '@/blocks/StatsBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { FeatureHighlightBlockComponent } from '@/blocks/FeatureHighlightBlock/Component'
import { Link } from '@/i18n/routing'

// ── Heavy client blocks — lazy-loaded to avoid shipping JS to every page ──
const FormBlock = dynamic(() =>
  import('@/blocks/Form/Component').then((m) => ({ default: m.FormBlock })),
)
const GalleryBlockComponent = dynamic(() =>
  import('@/blocks/GalleryBlock/Component').then((m) => ({ default: m.GalleryBlockComponent })),
)
const LearnMoreBlockComponent = dynamic(() =>
  import('@/blocks/LearnMoreBlock/Component').then((m) => ({ default: m.LearnMoreBlockComponent })),
)
const CodeBlock = dynamic(() =>
  import('@/blocks/Code/Component').then((m) => ({ default: m.CodeBlock })),
)
const FaqAccordionBlockComponent = dynamic(() =>
  import('@/blocks/FaqAccordionBlock/Component').then((m) => ({
    default: m.FaqAccordionBlockComponent,
  })),
)
const SvgMapBlockComponent = dynamic(() =>
  import('@/blocks/SvgMapBlock/Component').then((m) => ({ default: m.SvgMapBlockComponent })),
)
const EventSearchBlockComponent = dynamic(() =>
  import('@/blocks/EventSearchBlock/Component').then((m) => ({
    default: m.EventSearchBlockComponent,
  })),
)
import { MapExplorerBlockComponent } from '@/blocks/MapExplorerBlock/Component'
import { Container } from '@/components/ui'

// ── Plugin blocks — lazy-loaded (experience) ──
const ExperienceListingBlockComponent = dynamic(() =>
  import('@/plugins/experience-listing/blocks').then((m) => ({
    default: m.ExperienceListingBlockComponent,
  })),
)

// Helper to get href from link node
const getLinkHref = (linkNode: SerializedLinkNode): string => {
  const { linkType, url, doc } = linkNode.fields

  if (linkType === 'internal' && doc) {
    const { value, relationTo } = doc
    if (typeof value !== 'object') {
      return '#'
    }
    const slug = value.slug
    return `/${slug}`
  }

  return url || '#'
}

const headingStyles: Record<string, string> = {
  h1: 'font-heading font-bold text-[2.5rem] leading-[105%] md:text-[3.75rem] text-heading mb-3',
  h2: 'font-heading font-bold text-[1.75rem] leading-[115%] md:text-[2.5rem] text-heading mb-2 mt-6',
  h3: 'font-heading font-bold text-[1.25rem] leading-[110%] md:text-[1.75rem] text-heading mb-2 mt-4',
  h4: 'font-heading font-medium text-[1.25rem] leading-[130%] md:text-[1.5rem] text-heading mb-1.5 mt-3',
  h5: 'font-heading font-medium text-[1.125rem] leading-[130%] text-heading mb-1.5 mt-3',
  h6: 'font-heading font-medium text-base leading-[130%] text-heading mb-1 mt-2',
}

export const StyledHeadingConverter = {
  heading: ({
    node,
    nodesToJSX,
  }: {
    node: { tag: string; children: any[] }
    nodesToJSX: (args: { nodes: any[] }) => React.ReactNode
  }) => {
    const Tag = node.tag as keyof React.JSX.IntrinsicElements
    return <Tag className={headingStyles[node.tag] || ''}>{nodesToJSX({ nodes: node.children })}</Tag>
  },
}

export const LocaleAwareLinkConverter = {
  link: ({
    node,
    nodesToJSX,
  }: {
    node: SerializedLinkNode
    nodesToJSX: (args: { nodes: SerializedLinkNode['children'] }) => React.ReactNode
  }) => {
    const href = getLinkHref(node)
    const newTab = node.fields.newTab
    const isInternalUrl = href.startsWith('/') && !href.startsWith('//')
    const shouldOpenNewTab = isInternalUrl ? newTab : true
    const newTabProps = shouldOpenNewTab
      ? { rel: 'noopener noreferrer', target: '_blank' as const }
      : {}

    if (isInternalUrl) {
      return (
        <Link href={href} {...newTabProps}>
          {nodesToJSX({ nodes: node.children })}
        </Link>
      )
    }

    return (
      <a href={href} {...newTabProps}>
        {nodesToJSX({ nodes: node.children })}
      </a>
    )
  },
}

/** Base block converters shared across all richText renderers */
const baseBlockConverters: Record<string, (args: any) => React.ReactNode> = {
  // Shared blocks (also used in Posts)
  banner: ({ node }: any) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
  mediaBlock: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <MediaBlock {...node.fields} />
    </div>
  ),
  code: ({ node }: any) => <CodeBlock className="col-start-2" {...node.fields} />,
  cta: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <CallToActionBlock {...node.fields} />
    </div>
  ),
  // Page-specific blocks
  formBlock: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <FormBlock {...node.fields} />
    </div>
  ),
  experienceListing: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <ExperienceListingBlockComponent {...node.fields} />
    </div>
  ),
  iconCards: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <IconCardsBlockComponent {...node.fields} />
    </div>
  ),
  statisticsBanner: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <StatisticsBannerBlockComponent {...node.fields} />
    </div>
  ),
  fullWidthCta: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <FullWidthCtaBlockComponent {...node.fields} />
    </div>
  ),
  faqAccordion: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <FaqAccordionBlockComponent {...node.fields} />
    </div>
  ),
  pagesBlock: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <PagesBlockComponent {...node.fields} />
    </div>
  ),
  featureSection: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <FeatureSectionBlockComponent {...node.fields} />
    </div>
  ),
  masonryGallery: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <GalleryBlockComponent {...node.fields} />
    </div>
  ),
  featuredEvents: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <FeaturedEventsBlockComponent {...node.fields} />
    </div>
  ),
  eventSearch: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <EventSearchBlockComponent {...node.fields} />
    </div>
  ),
  factsListing: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <FactsListingBlockComponent {...node.fields} />
    </div>
  ),
  spacerBlock: ({ node }: any) => (
    <div className="relative z-0">
      <SpacerBlockComponent {...node.fields} />
    </div>
  ),
  stats: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <StatsBlockComponent {...node.fields} />
    </div>
  ),
  svgMap: ({ node }: any) => (
    <div className="relative">
      <SvgMapBlockComponent {...node.fields} />
    </div>
  ),
  learnMore: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <LearnMoreBlockComponent {...node.fields} />
    </div>
  ),
  featureHighlight: ({ node }: any) => (
    <div className="my-4 lg:my-8 z-10 relative">
      <FeatureHighlightBlockComponent {...node.fields} />
    </div>
  ),
  mapExplorer: ({ node }: any) => {    
    const fields = node.fields || {}
    return (
      <div className="my-4 lg:my-8 z-10 relative">
        <MapExplorerBlockComponent {...fields} />
      </div>
    )
  },
  archive: () => null, // Deprecated block — renders nothing
}

/** Fallback renderer for blocks without a registered converter. */
function UnknownBlock({ blockType }: { blockType: string }) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="my-8 rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 p-6 text-center text-sm text-amber-700">
        <p className="font-semibold">Unknown block: &ldquo;{blockType}&rdquo;</p>
        <p className="mt-1 text-xs text-amber-500">No converter registered for this block type.</p>
      </div>
    )
  }
  return null
}

/** Wraps a blocks converter map so unknown block types render a fallback instead of crashing. */
function withCatchAllBlocks(
  converters: Record<string, (args: any) => React.ReactNode>,
): Record<string, (args: any) => React.ReactNode> {
  return new Proxy(converters, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && !(prop in target)) {
        console.warn(`No converter found for block type: "${prop}". Rendering fallback component.`)
        const FallbackBlock = ({ node }: any) => (
          <UnknownBlock blockType={node?.fields?.blockType ?? prop} />
        )
        FallbackBlock.displayName = `FallbackBlock(${prop})`
        return FallbackBlock
      }
      return Reflect.get(target, prop, receiver)
    },
  })
}

/** Wraps a converter so its output is contained when at root level */
function withRootContainer(converter: (args: any) => React.ReactNode) {
  const WrappedConverter = (args: any) => {
    const result = converter(args)
    if (args.parent?.type === 'root') {
      return <Container>{result}</Container>
    }
    return result
  }
  WrappedConverter.displayName = `withRootContainer(${converter.name || 'anonymous'})`
  return WrappedConverter
}

/**
 * Creates a Lexical JSX converters function with all base block converters
 * plus optional extra blocks (e.g. columns at the page level).
 */
export function createBlockConverters(
  extraBlocks?: Record<string, (args: any) => React.ReactNode>,
  options?: { skipRootContainer?: boolean },
  pageId?: number,
) {
  return ({ defaultConverters }: { defaultConverters: any }) => {
    const wrap = options?.skipRootContainer
      ? (converter: any) => converter
      : withRootContainer

    const containedDefaults = Object.fromEntries(
      Object.entries(defaultConverters).map(([key, converter]) => [
        key,
        typeof converter === 'function' ? wrap(converter as any) : converter,
      ]),
    )

    // Paragraph converter with proper spacing for inline content
    const styledParagraph = ({
      node,
      nodesToJSX,
    }: {
      node: { children: any[] }
      nodesToJSX: (args: { nodes: any[] }) => React.ReactNode
    }) => <p className="mb-4 leading-relaxed">{nodesToJSX({ nodes: node.children })}</p>

    // Override pagesBlock to pass pageId for "children of current page" default
    const blockOverrides: Record<string, (args: any) => React.ReactNode> = {}
    if (pageId) {
      blockOverrides.pagesBlock = ({ node }: any) => (
        <div className="my-4 lg:my-8 z-10 relative">
          <PagesBlockComponent {...node.fields} pageId={pageId} />
        </div>
      )
    }

    return {
      ...containedDefaults,
      heading: wrap(StyledHeadingConverter.heading),
      paragraph: wrap(styledParagraph),
      ...LocaleAwareLinkConverter,
      blocks: withCatchAllBlocks({
        ...baseBlockConverters,
        ...blockOverrides,
        ...extraBlocks,
      }),
    }
  }
}
