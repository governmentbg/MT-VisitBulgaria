import type { StaticImageData } from 'next/image'

import { cn } from '@/components/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'
import { ParallaxImage } from './components/ParallaxImage'
import type { CaptionEntry } from './captions/types'
import { MediaBlockClient } from './components/MediaBlockClient'

type Props = MediaBlockProps & {
  captionClassName?: string
  className?: string
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

const layoutConfig = {
  default: { inner: 'container max-w-5xl mx-auto', media: 'rounded-[0.8rem] border border-border overflow-hidden' },
  fullWidth: { inner: 'container', media: 'rounded-[0.8rem] overflow-hidden' },
  fullBleed: { inner: 'w-full', media: 'w-full' },
} as const

const bgConfig = {
  none: { section: '', caption: '', heading: 'text-heading' },
  primaryLight: { section: 'bg-[var(--color-primary-50)] py-12 md:py-16', caption: '', heading: 'text-heading' },
  dark: { section: 'bg-[var(--color-grey-800)] py-12 md:py-16', caption: 'text-white [&_p]:text-white/80 [&_h3]:text-white [&_h4]:text-white', heading: 'text-white' },
  light: { section: 'bg-[var(--color-grey-0)] py-12 md:py-16', caption: '', heading: 'text-heading' },
} as const

const heightConfig = {
  auto: '',
  sm: 'h-[30vh]',
  md: 'h-[50vh]',
  lg: 'h-[70vh]',
  screen: 'h-screen',
} as const

const alignConfig = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

function getVideoSrc(block: MediaBlockProps): string | undefined {
  const source = block.videoSource
  if (!source) return undefined

  switch (source.sourceType) {
    case 'upload': {
      const file = source.videoFile
      if (file && typeof file === 'object') return file.url ?? undefined
      return undefined
    }
    case 'url':
      return source.videoUrl ?? undefined
    default:
      return undefined
  }
}

function resolveCaptions(block: MediaBlockProps): CaptionEntry[] {
  if (!block.captions?.length) return []

  return block.captions
    .filter((c) => c.startTime != null && c.endTime != null && c.text)
    .map((c) => ({
      startTime: c.startTime!,
      endTime: c.endTime!,
      text: c.text!,
      fontSize: c.fontSize ?? undefined,
      fontFamily: c.fontFamily ?? undefined,
      fontWeight: c.fontWeight ?? undefined,
      textColor: c.textColor ?? undefined,
      verticalPosition: c.verticalPosition ?? undefined,
      horizontalAlignment: c.horizontalAlignment ?? undefined,
      background: c.background ?? undefined,
      containerWidth: c.containerWidth ?? undefined,
      textShadow: c.textShadow ?? undefined,
      animation: c.animation ?? undefined,
      x: c.x ?? undefined,
      y: c.y ?? undefined,
    }))
}

/** Backward compat: map old sizing data to a layout value */
function mapLegacySizing(sizing?: { width?: string | null; fullBleed?: boolean | null }): string {
  if (!sizing) return 'default'
  if (sizing.fullBleed) return 'fullBleed'
  if (sizing.width === 'full') return 'fullWidth'
  return 'default'
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    mediaType = 'image',
    blockCaption,
    heading,
    description,
  } = props

  // Resolve layout, background, alignment, height, parallax
  const resolvedLayout = props.layout ?? mapLegacySizing((props as any).sizing)
  const resolvedBg = props.background ?? 'none'
  const resolvedAlign = (props as any).textAlignment ?? 'center'
  const resolvedHeight = (props as any).imageHeight ?? 'auto'
  const enableParallax = (props as any).enableParallax ?? false

  const lc = layoutConfig[resolvedLayout as keyof typeof layoutConfig] ?? layoutConfig.default
  const bc = bgConfig[resolvedBg as keyof typeof bgConfig] ?? bgConfig.none
  const hc = heightConfig[resolvedHeight as keyof typeof heightConfig] ?? ''
  const ac = alignConfig[resolvedAlign as keyof typeof alignConfig] ?? alignConfig.center
  const isFullBleed = resolvedLayout === 'fullBleed'
  const imgRounding = isFullBleed ? '' : 'rounded-xl'

  // Backward compat: image mode uses existing media caption from the upload
  let legacyCaption
  if (mediaType === 'image' && media && typeof media === 'object') {
    legacyCaption = media.caption
  }

  const hasBg = resolvedBg !== 'none'

  // Compute aspect ratio from media dimensions to prevent layout shift
  const mediaWidth = media && typeof media === 'object' ? media.width : undefined
  const mediaHeight = media && typeof media === 'object' ? media.height : undefined
  const aspectRatio =
    resolvedHeight !== 'auto' ? undefined : (
      mediaWidth && mediaHeight ? `${mediaWidth} / ${mediaHeight}` : '16 / 9'
    )

  return (
    <div
      className={cn(bc.section, className)}
      style={hasBg ? { width: '100vw', marginLeft: 'calc(-50vw + 50%)' } : undefined}
    >
      <div className={cn(lc.inner)}>
        {/* Heading & Description */}
        {(heading || description) && (
          <div className={cn('mb-8', ac)}>
            {heading && (
              <h2 className={cn(
                'font-heading text-3xl font-bold leading-[1.15] md:text-5xl lg:text-[60px]',
                bc.heading,
              )}>
                {heading}
              </h2>
            )}
            {description && (
              <p className={cn(
                'mt-4 text-lg font-medium leading-[1.6] text-grey-500',
                resolvedBg === 'dark' && 'text-white/70',
              )}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Image mode */}
        {mediaType === 'image' && (media || staticImage) && (
          enableParallax ? (
            <ParallaxImage
              media={media}
              imgClassName={imgRounding}
              containerClassName={cn(lc.media, hc || 'max-h-[60vh]')}
              aspectRatio={aspectRatio}
            />
          ) : (
            <div
              className={cn(
                'overflow-hidden',
                lc.media,
                hc || 'max-h-[60vh]',
              )}
              style={aspectRatio ? { aspectRatio } : undefined}
            >
              <Media
                imgClassName={cn('w-full h-full object-cover', imgRounding, imgClassName)}
                resource={media}
                src={staticImage}
                preferredSize="large"
                usePayloadSizes
              />
            </div>
          )
        )}

        {/* Video mode */}
        {mediaType === 'video' && (
          <div style={{ aspectRatio: '16 / 9' }}>
            <MediaBlockClient
              isEmbed={props.videoSource?.sourceType === 'embed'}
              embedUrl={props.videoSource?.embedUrl ?? undefined}
              videoSrc={getVideoSrc(props)}
              captions={resolveCaptions(props)}
              autoPlay={props.videoOptions?.autoPlay ?? false}
              muted={props.videoOptions?.autoPlay ?? false}
              loop={props.videoOptions?.loop ?? false}
              showControls={props.videoOptions?.showControls ?? true}
            />
          </div>
        )}
      </div>

      {/* Block-level caption (richText, all modes) */}
      {blockCaption && (
        <div
          className={cn(
            'mt-6',
            ac,
            bc.caption,
            { container: !disableInnerContainer && resolvedLayout !== 'fullBleed' },
            captionClassName,
          )}
        >
          <RichText data={blockCaption} enableGutter={false} />
        </div>
      )}

      {/* Legacy caption from media upload (image mode backward compat) */}
      {!blockCaption && legacyCaption && (
        <div
          className={cn(
            'mt-6',
            ac,
            bc.caption,
            { container: !disableInnerContainer && resolvedLayout !== 'fullBleed' },
            captionClassName,
          )}
        >
          <RichText data={legacyCaption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
