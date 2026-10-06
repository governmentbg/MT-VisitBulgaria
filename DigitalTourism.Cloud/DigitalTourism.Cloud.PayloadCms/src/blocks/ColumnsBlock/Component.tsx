import React from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { createBlockConverters } from '@/components/PageContent/converters'

type ColumnsBlockProps = {
  blockType: 'columns'
  columnCount: '2' | '3' | '4'
  column1?: DefaultTypedEditorState | null
  column2?: DefaultTypedEditorState | null
  column3?: DefaultTypedEditorState | null
  column4?: DefaultTypedEditorState | null
}

// Converters without columns block — prevents circular nesting
// skipRootContainer: columns already have their own container wrapper
const columnConverters = createBlockConverters(undefined, { skipRootContainer: true })

const gridClasses: Record<string, string> = {
  '2': 'grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8',
  '3': 'grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8',
  '4': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8',
}

export const ColumnsBlockComponent: React.FC<ColumnsBlockProps> = ({
  columnCount,
  column1,
  column2,
  column3,
  column4,
}) => {
  const count = columnCount || '2'
  const allColumns = [column1, column2, column3, column4]
  const visibleColumns = allColumns.slice(0, Number(count))

  return (
    <div className="container">
      <div className={gridClasses[count] || gridClasses['2']}>
        {visibleColumns.map((data, i) => (
          <div key={i}>
            {data && (
              <ConvertRichText converters={columnConverters} data={data} className="prose md:prose-md dark:prose-invert max-w-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
