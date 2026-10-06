import React from 'react'
import RichText from '@/components/RichText'

export interface RichTextSectionProps {
  data: any
  heading: string
  variant?: 'info' | 'contacts'
  className?: string
}

export function RichTextSection({
  data,
  heading,
  variant = 'info',
  className,
}: RichTextSectionProps) {
  if (!data?.root?.children?.length) return null

  if (variant === 'contacts') {
    return (
      <div className="container">
        <div className="mx-auto max-w-[1340px] pb-16">
          <h3 className="font-heading text-2xl font-bold text-heading mb-4 md:text-3xl">
            {heading}
          </h3>
          <RichText data={data} enableGutter={false} className="prose-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className={className ?? 'mt-12'}>
      <h3 className="font-heading text-2xl font-bold text-heading mb-4 md:text-3xl">{heading}</h3>
      <RichText data={data} enableGutter={false} className="prose-lg" />
    </div>
  )
}
