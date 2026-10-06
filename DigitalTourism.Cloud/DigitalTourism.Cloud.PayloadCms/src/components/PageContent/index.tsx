/**
 * Server-only component for rendering page content (Lexical richText with BlocksFeature).
 * This is separated from RichText to avoid pulling server-only block imports
 * (e.g. ArchiveBlock → payloadClient → revalidateTag) into client bundles.
 */
import React from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { createBlockConverters } from './converters'
import { ColumnsBlockComponent } from '@/blocks/ColumnsBlock/Component'

// Default converters (no pageId) — used when pageId is not available
const defaultPageConverters = createBlockConverters({
  columns: ({ node }: any) => (
    <div className="my-2 lg:my-8 z-10 relative">
      <ColumnsBlockComponent {...node.fields} />
    </div>
  ),
})

type Props = {
  data: DefaultTypedEditorState
  pageId?: number
}

export function PageContent({ data, pageId }: Props) {
  // If pageId is provided, create converters that pass it to PagesBlock
  const converters = pageId
    ? createBlockConverters(
        {
          columns: ({ node }: any) => (
            <div className="my-2 lg:my-8 z-10 relative">
              <ColumnsBlockComponent {...node.fields} />
            </div>
          ),
        },
        undefined,
        pageId,
      )
    : defaultPageConverters

  return <ConvertRichText converters={converters} data={data} className="max-w-none" />
}
