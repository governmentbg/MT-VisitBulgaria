'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { ColumnsPhotoAlbum } from 'react-photo-album'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import type { Photo } from 'react-photo-album'
import type { Slide } from 'yet-another-react-lightbox'
import { cn } from '@/components/ui'
import { lightboxRender } from '@/components/ui/lightboxRender'

export interface GalleryMasonryProps {
  photos: Photo[]
  slides: Slide[]
  columns?: number | ((containerWidth: number) => number)
  spacing?: number | ((containerWidth: number) => number)
  className?: string
}

const defaultColumns = (containerWidth: number) => {
  if (containerWidth < 600) return 2
  if (containerWidth < 900) return 3
  return 4
}

const defaultSpacing = (containerWidth: number) => {
  if (containerWidth < 600) return 12
  if (containerWidth < 900) return 20
  return 32
}

const plugins = [Counter, Thumbnails, Zoom]

const W = 518

// Height patterns per column position — each column's items sum to the same
// total so the bottom edge stays even. The pattern repeats every 4 items.
// Col 0: tall-short-tall-short (685+350+680+400 = 2115)
// Col 1: short-tall-short-tall (350+560+470+560 = 1940 → scaled)
// Col 2: medium-medium-tall-short (470+540+680+420 = 2110 → scaled)
const COL_HEIGHTS = [
  [685, 350, 680, 400],
  [350, 560, 470, 560],
  [470, 540, 680, 420],
]

/**
 * ColumnsPhotoAlbum distributes photos sequentially: photo[0] → col 0,
 * photo[1] → col 1, photo[2] → col 2, photo[3] → col 0, etc.
 * We assign heights based on column position to ensure balanced totals.
 */
function buildBalancedPhotos(photos: Photo[], colCount: number): Photo[] {
  if (colCount <= 1) {
    // Single column: alternate tall/short for visual interest
    const ratios = [0.76, 1.1, 0.9, 1.08]
    return photos.map((p, i) => ({
      ...p,
      width: W,
      height: Math.round(W / ratios[i % ratios.length]),
    }))
  }

  // Assign each photo to its column (sequential round-robin)
  const colItemCounts = new Array(colCount).fill(0)
  const colTotals = new Array(colCount).fill(0)

  const heights = photos.map((_, i) => {
    const col = i % colCount
    const posInCol = colItemCounts[col]
    colItemCounts[col]++
    const colPattern = COL_HEIGHTS[col % COL_HEIGHTS.length]
    const h = colPattern[posInCol % colPattern.length]
    colTotals[col] += h
    return h
  })

  // Scale all columns to match the tallest column's total
  const maxTotal = Math.max(...colTotals)
  const scales = colTotals.map((t) => (t > 0 ? maxTotal / t : 1))

  return photos.map((p, i) => {
    const col = i % colCount
    return {
      ...p,
      width: W,
      height: Math.round(heights[i] * scales[col]),
    }
  })
}

export const GalleryMasonry: React.FC<GalleryMasonryProps> = ({
  photos,
  slides,
  columns = defaultColumns,
  spacing = defaultSpacing,
  className,
}) => {
  const [index, setIndex] = useState(-1)

  // Resolve column count for balanced-height pre-computation.
  // Use defaultContainerWidth (768) when columns is a responsive function,
  // matching the server-side render to avoid layout shift on hydration.
  const resolvedCols = typeof columns === 'function' ? columns(768) : columns

  const masonryPhotos = useMemo(
    () => buildBalancedPhotos(photos, resolvedCols),
    [photos, resolvedCols],
  )

  const handleClick = useCallback(
    ({ index: i }: { index: number }) => setIndex(i),
    [],
  )

  if (photos.length === 0) return null

  return (
    <div className={cn(className)}>
      <ColumnsPhotoAlbum
        photos={masonryPhotos}
        columns={columns}
        spacing={spacing}
        defaultContainerWidth={768}
        onClick={handleClick}
        render={{
          image: (props) => (
            <img
              {...props}
              alt={props.alt || ''}
              className={cn(props.className, 'rounded-2xl object-cover')}
            />
          ),
        }}
      />

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={plugins}
        render={lightboxRender}
        controller={{ closeOnPullDown: true }}
      />
    </div>
  )
}
