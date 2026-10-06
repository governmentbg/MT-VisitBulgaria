import React from 'react'

import type { FeatureHighlightBlock as FeatureHighlightBlockProps } from '@/payload-types'

import { FeatureHighlight } from '@/components/FeatureHighlight'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const FeatureHighlightBlockComponent: React.FC<FeatureHighlightBlockProps> = ({
  heading,
  description,
  links,
  image,
  imagePosition = 'right',
  showBackground = true,
  showDecoration = false,
}) => {
  const descriptionNode = description ? (
    <RichText data={description} enableGutter={false} enableProse className="text-grey-600" />
  ) : undefined

  const imageNode = (
    <Media
      resource={image}
      usePayloadSizes
      preferredSize="large"
      imgClassName="w-full h-full object-cover"
      className="aspect-[4/3] md:aspect-auto md:h-full"
    />
  )

  const actionsNode =
    links && links.length > 0 ? (
      <>
        {links.map(
          ({ link }: NonNullable<FeatureHighlightBlockProps['links']>[number], i: number) => (
            <CMSLink key={i} size="sm" {...link} />
          ),
        )}
      </>
    ) : undefined

  return (
    <FeatureHighlight
      heading={heading}
      description={descriptionNode}
      image={imageNode}
      imagePosition={imagePosition ?? 'right'}
      showBackground={showBackground ?? true}
      showDecoration={showDecoration ?? false}
      actions={actionsNode}
    />
  )
}
