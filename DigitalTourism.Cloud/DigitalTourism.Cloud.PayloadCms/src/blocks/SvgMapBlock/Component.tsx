import React from 'react'

import type { SvgMapBlock as SvgMapBlockProps } from '@/payload-types'
import { SvgMapClient } from './Component.client'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const SvgMapBlockComponent: React.FC<SvgMapBlockProps> = (props) => {
  const { heading, subtitle, svgFile, backgroundImage, regions, defaultRegionIndex = 0 } = props

  if (!regions?.length) return null

  // Resolve SVG URL
  const svgMedia = typeof svgFile === 'object' ? svgFile : null
  const svgUrl = svgMedia?.url ? getMediaUrl(svgMedia.url) : null
  if (!svgUrl) return null

  // Resolve background image URL
  const bgMedia = typeof backgroundImage === 'object' ? backgroundImage : null
  const bgUrl = bgMedia?.url ? getMediaUrl(bgMedia.url) : undefined

  // Map regions from Payload types to plain client-side props
  const clientRegions = regions.map((region) => {
    let linkHref: string | undefined
    let linkLabel: string | undefined

    if (region.link) {
      linkLabel = region.link.label || undefined

      if (region.link.type === 'custom' && region.link.url) {
        linkHref = region.link.url
      } else if (region.link.type === 'reference' && region.link.reference) {
        const ref = region.link.reference.value
        if (typeof ref === 'object' && ref !== null) {
          const page = ref as { breadcrumbs?: { url?: string | null }[]; slug?: string }
          if (page.breadcrumbs?.length) {
            linkHref = page.breadcrumbs[page.breadcrumbs.length - 1]?.url || undefined
          } else if (page.slug) {
            linkHref = `/${page.slug}`
          }
        }
      }
    }

    const gallery = (region.gallery || [])
      .map((img) => {
        if (typeof img === 'object' && img !== null) {
          const medium = img.sizes?.medium
          return {
            url: getMediaUrl(medium?.url || img.url),
            alt: img.alt || '',
            width: medium?.width || img.width || 0,
            height: medium?.height || img.height || 0,
          }
        }
        return null
      })
      .filter((g): g is NonNullable<typeof g> => g !== null)

    return {
      regionId: region.regionId,
      name: region.name,
      description: region.description || undefined,
      linkHref,
      linkLabel,
      gallery,
    }
  })

  return (
    <SvgMapClient
      heading={heading}
      subtitle={subtitle || undefined}
      svgUrl={svgUrl}
      backgroundImageUrl={bgUrl}
      regions={clientRegions}
      defaultRegionIndex={defaultRegionIndex ?? 0}
    />
  )
}
