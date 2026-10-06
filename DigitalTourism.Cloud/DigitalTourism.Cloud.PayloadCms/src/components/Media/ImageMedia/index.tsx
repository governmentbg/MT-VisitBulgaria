import type { StaticImageData } from 'next/image'

import { cn } from '@/components/ui'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps, PayloadImageSize } from '../types'

import { cssVariables } from '@/cssVariables'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Media } from '@/payload-types'

const { breakpoints } = cssVariables

// Fallback base64 blur placeholder
const fallbackBlur =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABchJREFUWEdtlwtTG0kMhHtGM7N+AAdcDsjj///EBLzenbtuadbLJaZUTlHB+tRqSesETB3IABqQG1KbUFqDlQorBSmboqeEBcC1d8zrCixXYGZcgMsFmH8B+AngHdurAmXKOE8nHOoBrU6opcGswPi5KSP9CcBaQ9kACJH/ALAA1xm4zMD8AczvQCcAQeJVAZsy7nYApTSUzwCHUKACeUJi9TsFci7AHmDtuHYqQIC9AgQYKnSwNAig4NyOOwXq/xU47gDYggarjIpsRSEA3Fqw7AGkwgW4fgALAdiC2btKgNZwbgdMbEFpqFR2UyCR8xwAhf8bUHIGk1ckMyB5C1YkeWAdAPQBAeiD6wVYPoD1HUgXwFagZAGc6oSpTmilopoD5GzISQD3odcNIFca0BUQQM5YA2DpHV0AYURBDIAL0C+ugC0C4GedSsVUmwC8/4w8TPiwU6AClJ5RWL1PgQNkrABWdKB3YF3cBwRY5lsI4ApkKpCQi+FIgFJU/TDgDuAxAAwonJuKpGD1rkCXCR1ALyrAUSSEQAhwBdYZ6DPAgSUA2c1wKIZmRcHxMzMYR9DH8NlbkAwwApSAcABwBwTAbb6owAr0AFiZPILVEyCtMmK2jCkTwFDNUNj7nJETQx744gCUmgkZVGJUHyakEZE4W91jtGFA9KsD8Z3JFYDlhGYZLWcllwJMnplcPy+csFAgAAaIDOgeuAGoB96GLZg4kmtfMjnr6ig5oSoySsoy3ya/FMivXZWxwr0KIf9nACbfqcBEgmBSAtAlIT83R+70IWpyACamIjf5E1Iqb9ECVmnoI/FvAIRk8s2J0Y5IquQDgB+5wpScw5AUTC75VTmTs+72NUzoCvQIaAXv5Q8PDAZKLD+MxLv3RFE7KlsQChgBIlKiCv5ByaZv3gJZNm8AnVMhAN+EjrtTYQMICJpu6/0aiQnhClANlz+Bw0cIWa8ev0sBrtrhAyaXEnrfGfATQJiRKih5vKeOHNXXPFrgyamAADh0Q4F2/sESojomDS9o9k0b0H83xjB8qL+JNoTjN+enjpaBpingRh4e8MSugudM030A8FeqMI6PFIgNyPehkpZWGFEAARIQdH5LcAAqIACHkAJqg4OoBccHAuz76wr4BbzFOEa8iBuAZB8AtJHLP2VgMgJw/EIBowo7HxCAH3V6dAXEE/vZ5aZIA8BP8RKhm7Cp8BnAMnAQADdgQDA520AVIpScP+enHz0Gwp25h4i2dPg5FkDXrbsdJikQwXuWgaM5gEMk1AgH4DKKFjDf3bMD+FjEeIxLlRKYnBk2BbquvSDCAQ4gwZiMAAmH4gBTyRtEsYxi7gP6QSrc//39BrDNqG8rtYTmC4BV1SfMhOhaumFCT87zy4pPhQBZEK1kQVRjJBBi7AOlePgyAPYjwlvtagx9e/dnQraAyS894TIkkAIEYMKEc8k4EqJ68lZ5jjNqcQC2QteQOf7659umwBgPybNtK4dg9WvnMyFwXYGP7uEO1lwJgAnPNeMYMVXbIIYKFioI4PGFt+BWPVfmWJdjW2lTUnLGCswECAgaUy86iwA1464ajo0QhgMBFGyBoZahANsMpMfXr1JA1SN29m5lqgXj+UPV85uRA7yv/KYUO4Tk7Hc1AZwbIRzg0AyNj2UlAMwfSLSMnl7fdAbcxHuA27YaAMvaQ4GOjwX4RTUGAG8Ge14N963g1AynqUiFqRX9noasxT4b8entNRQYyamk/3tYcHsO7R3XJRRYOn4tw4iUnwBM5gDnySGOreAwAGo8F9IDHEcq8Pz2Kg/oXCpuIL6tOPD8LsDn0ABYQoGFRowlsAEUPPDrGAGowAbgKsgDMmE8mDy/vXQ9IAwI7u4wta+gAdAdgB64Ah9SgD4IgGKhwACoAjgNgFDhtxY8f33ZTMjqdTAiHMBPrn8ZWkEfzFdX4Oc1AHg3+ADbvN8PU8WdFKg4Tt6CQy2+D4YHaMT/JP4XzbAq98cPDIUAAAAASUVORK5CYII='

// Payload image sizes with their widths (ordered small to large)
const payloadSizeWidths: Record<PayloadImageSize, number> = {
  thumbnail: 300,
  square: 500,
  small: 600,
  medium: 900,
  og: 1200,
  large: 1400,
  xlarge: 1920,
}

// Ordered sizes for srcset (smallest to largest, excluding special sizes)
const orderedSizes: PayloadImageSize[] = ['thumbnail', 'small', 'medium', 'large', 'xlarge']

// Build srcset from Payload prerendered sizes, optionally capped at a max size
function buildSrcSet(
  resource: Media,
  cacheTag?: string | null,
  maxSize?: PayloadImageSize,
): string {
  const sizes = resource.sizes
  if (!sizes) return ''

  const srcsetParts: string[] = []
  const maxWidth = maxSize ? payloadSizeWidths[maxSize] : Infinity

  for (const sizeName of orderedSizes) {
    const sizeWidth = payloadSizeWidths[sizeName]
    // Stop if we've exceeded the max size
    if (sizeWidth > maxWidth) break

    const sizeData = sizes[sizeName]
    if (sizeData?.url && sizeData.width) {
      const url = getMediaUrl(sizeData.url, cacheTag)
      srcsetParts.push(`${url} ${sizeData.width}w`)
    }
  }

  return srcsetParts.join(', ')
}

// Get best size URL for a specific preferred size
function getSizeUrl(
  resource: Media,
  preferredSize: PayloadImageSize,
  cacheTag?: string | null,
): { url: string; width?: number; height?: number } {
  const sizeData = resource.sizes?.[preferredSize]

  if (sizeData?.url) {
    return {
      url: getMediaUrl(sizeData.url, cacheTag),
      width: sizeData.width ?? undefined,
      height: sizeData.height ?? undefined,
    }
  }

  // Fallback: largest available prerendered size (avoid raw original)
  for (const sizeName of [...orderedSizes].reverse()) {
    const fallback = resource.sizes?.[sizeName]
    if (fallback?.url) {
      return {
        url: getMediaUrl(fallback.url, cacheTag),
        width: fallback.width ?? undefined,
        height: fallback.height ?? undefined,
      }
    }
  }

  // Last resort: original (only if zero sizes exist, e.g. SVGs)
  return {
    url: getMediaUrl(resource.url, cacheTag),
    width: resource.width ?? undefined,
    height: resource.height ?? undefined,
  }
}

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
    usePayloadSizes = false,
    preferredSize,
    mobileMaxSize,
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''
  let srcSet: string | undefined  

  const isPayloadResource = !srcFromProps && resource && typeof resource === 'object'

  if (isPayloadResource) {
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth, sizes } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || ''

    const cacheTag = resource.updatedAt

    if (usePayloadSizes && sizes) {
      // Use prerendered sizes with native <img> srcset
      if (preferredSize) {
        // Get the preferred size as the default src
        const sizeInfo = getSizeUrl(resource, preferredSize, cacheTag)
        src = sizeInfo.url
        width = sizeInfo.width
        height = sizeInfo.height
        // Build srcset up to and including the preferred size
        srcSet = buildSrcSet(resource, cacheTag, preferredSize)
      } else {
        // Use srcset for responsive images (all sizes)
        src = getMediaUrl(url, cacheTag)
        srcSet = buildSrcSet(resource, cacheTag)
      }
    } else if (preferredSize && sizes) {
      // Use preferred Payload size as src, but render via Next.js Image for optimization
      const sizeInfo = getSizeUrl(resource, preferredSize, cacheTag)
      src = sizeInfo.url
      width = sizeInfo.width
      height = sizeInfo.height
    } else {
      src = getMediaUrl(url, cacheTag)
    }
  }

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined)

  // Use native img with srcset when using Payload sizes
  if (usePayloadSizes && isPayloadResource)  {
    const sizes =
      sizeFromProps ||
      Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value}px`)
        .join(', ') + ', 100vw'

    // Fill styles matching Next.js Image fill behavior
    const fillStyles: React.CSSProperties = fill
      ? {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }
      : {}

    // Build a mobile-capped srcset when mobileMaxSize is set.
    // The <source media> takes priority on matching viewports, so the browser
    // won't pick anything larger — regardless of device pixel ratio.
    let mobileSrcSet: string | undefined
    if (mobileMaxSize && isPayloadResource) {
      mobileSrcSet = buildSrcSet(resource, resource.updatedAt, mobileMaxSize)
    }

    return (
      <picture className={cn(fill && 'absolute inset-0', pictureClassName)}>
        {mobileSrcSet && (
          <source
            media="(max-width: 768px)"
            srcSet={mobileSrcSet}
            sizes="100vw"
          />
        )}
        <img
          alt={alt || ''}
          className={cn(imgClassName)}
          loading={loading}
          src={src as string}
          sizes={sizes}
          srcSet={srcSet}
          width={width}
          height={height}
          style={fill ? fillStyles : undefined}
          fetchPriority={priority ? 'high' : undefined}
        />
      </picture>
    )
  }

  // Default: use Next.js Image
  const nextSizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(', ')

  return (
    <picture className={cn(fill && 'absolute inset-0', pictureClassName)}>
      <NextImage
        alt={alt || ''}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        placeholder="blur"
        blurDataURL={fallbackBlur}
        priority={priority}
        quality={75}
        loading={loading}
        sizes={nextSizes}
        src={src}
        width={!fill ? width : undefined}
      />
    </picture>
  )
}
