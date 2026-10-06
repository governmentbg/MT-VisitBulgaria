import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/components/ui'
import { Link } from '@/i18n/routing'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

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

// Custom link converter that uses locale-aware Link for internal URLs
const LocaleAwareLinkConverter = {
  link: ({ node, nodesToJSX }: { node: SerializedLinkNode; nodesToJSX: (args: { nodes: SerializedLinkNode['children'] }) => React.ReactNode }) => {
    const href = getLinkHref(node)
    const newTab = node.fields.newTab

    // Check if this is an internal URL (starts with / but not //)
    const isInternalUrl = href.startsWith('/') && !href.startsWith('//')

    // For internal URLs, respect the newTab setting
    // For external URLs, always open in new tab for better UX
    const shouldOpenNewTab = isInternalUrl ? newTab : true
    const newTabProps = shouldOpenNewTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {}

    if (isInternalUrl) {
      return (
        <Link href={href} {...newTabProps}>
          {nodesToJSX({ nodes: node.children })}
        </Link>
      )
    }

    // External URLs use regular anchor tag (always opens in new tab)
    return (
      <a href={href} {...newTabProps}>
        {nodesToJSX({ nodes: node.children })}
      </a>
    )
  },
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
        const FallbackBlock = ({ node }: any) => <UnknownBlock blockType={node?.fields?.blockType ?? prop} />
        FallbackBlock.displayName = `FallbackBlock(${prop})`
        return FallbackBlock
      }
      return Reflect.get(target, prop, receiver)
    },
  })
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LocaleAwareLinkConverter,
  blocks: withCatchAllBlocks({
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  }),
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
