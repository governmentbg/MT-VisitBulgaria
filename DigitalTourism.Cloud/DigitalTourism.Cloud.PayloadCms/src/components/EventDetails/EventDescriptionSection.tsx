import React from 'react'
import { cn } from '@/components/ui'
import RichText from '@/components/RichText'
import type { Category, Tag } from '@/payload-types'

export interface EventDescriptionSectionProps {
  heading?: string
  categories?: (Category | number)[]
  tags?: (Tag | number)[]
  description?: any
  className?: string
}

export const EventDescriptionSection: React.FC<EventDescriptionSectionProps> = ({
  heading,
  categories,
  tags,
  description,
  className,
}) => {
  const categoryNames =
    categories
      ?.map((cat) => (typeof cat === 'object' && cat !== null ? cat.title : null))
      .filter(Boolean) ?? []

  const tagNames =
    tags
      ?.map((tag) => (typeof tag === 'object' && tag !== null ? tag.title : null))
      .filter(Boolean) ?? []

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {heading && (
        <h2 className="font-heading text-4xl font-bold leading-[1.15] text-heading mb-8 md:text-[60px]">
          {heading}
        </h2>
      )}

      {(categoryNames.length > 0 || tagNames.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {categoryNames.map((name, i) => (
            <span
              key={`cat-${i}`}
              className={cn(
                'inline-flex items-center justify-center rounded-full px-4 py-2 text-base font-medium',
                i === 0 ? 'bg-primary-50 text-black' : 'bg-grey-25 text-black',
              )}
            >
              {name}
            </span>
          ))}
          {tagNames.map((name, i) => (
            <span
              key={`tag-${i}`}
              className="inline-flex items-center justify-center rounded-full border border-grey-200 bg-white px-4 py-2 text-base font-medium text-grey-600"
            >
              {name}
            </span>
          ))}
        </div>
      )}

      {description && (
        <RichText
          data={description}
          enableGutter={false}
          className="prose-lg"
        />
      )}
    </div>
  )
}
