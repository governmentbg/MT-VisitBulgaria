import type { Media } from '@/payload-types'
import type { Photo } from 'react-photo-album'
import type { Slide } from 'yet-another-react-lightbox'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type GalleryItem = number | Media

/** Size names in ascending width order, excluding cropped variants (square, og) */
const SRCSET_SIZES = ['thumbnail', 'small', 'medium', 'large', 'xlarge'] as const

interface MappedGallery {
  photos: Photo[]
  slides: Slide[]
}

export function mapGalleryMedia(gallery: GalleryItem[]): MappedGallery {
  const photos: Photo[] = []
  const slides: Slide[] = []

  for (const item of gallery) {
    if (typeof item !== 'object' || item === null) continue
    if (!item.url || !item.width || !item.height) continue
    if (item.mimeType?.includes('video')) continue

    const srcSet = buildSrcSet(item)
    const alt = item.alt ?? ''

    // Grid: use medium URL for performance, but ORIGINAL dimensions for layout
    // (medium is a fixed crop like 900x600 — using it would make masonry look like a grid)
    const medium = item.sizes?.medium
    const gridSrc = medium?.url ? getMediaUrl(medium.url) : getMediaUrl(item.url)

    photos.push({
      src: gridSrc,
      width: item.width,
      height: item.height,
      alt,
      srcSet,
    })

    // Lightbox: use original as primary, full srcSet for browser selection
    slides.push({
      src: getMediaUrl(item.url),
      width: item.width,
      height: item.height,
      alt,
      srcSet,
    })
  }

  return { photos, slides }
}

function buildSrcSet(media: Media): { src: string; width: number; height: number }[] {
  const entries: { src: string; width: number; height: number }[] = []

  for (const sizeName of SRCSET_SIZES) {
    const size = media.sizes?.[sizeName]
    if (size?.url && size.width && size.height) {
      entries.push({
        src: getMediaUrl(size.url),
        width: size.width,
        height: size.height,
      })
    }
  }

  // Add original as the largest entry if it's wider than the last srcSet size
  if (media.url && media.width && media.height) {
    const last = entries[entries.length - 1]
    if (!last || media.width > last.width) {
      entries.push({
        src: getMediaUrl(media.url),
        width: media.width,
        height: media.height,
      })
    }
  }

  return entries
}
