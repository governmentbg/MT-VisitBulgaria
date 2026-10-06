import React from 'react'

import type { SpacerBlock as SpacerBlockProps } from '@/payload-types'
import { SpacerScene } from '@/components/SpacerDisplay/SpacerScene'
import type { SpacerSceneProps, OverlayTextFont } from '@/components/SpacerDisplay/types'

/** Safely extract URL from a Payload media field, preferring the `large` size */
function resolveMediaUrl(media: unknown): string {
  if (!media || typeof media !== 'object') return ''
  const m = media as Record<string, unknown>
  const sizes = m.sizes as Record<string, { url?: string }> | undefined
  const largeUrl = sizes?.large?.url
  if (typeof largeUrl === 'string' && largeUrl) return largeUrl
  if (typeof m.url === 'string' && m.url) return m.url
  return ''
}

export const SpacerBlockComponent: React.FC<SpacerBlockProps> = (props) => {
  const { image, alt, height, overlayText, fadeIn, fadeOut, spacing } = props

  const src = resolveMediaUrl(image)
  if (!src) return null

  const sceneProps: SpacerSceneProps = {
    image: src,
    alt: alt || undefined,
    height: height || '60vh',
  }

  if (fadeIn) {
    sceneProps.fadeIn = {
      enabled: fadeIn.enabled ?? true,
      color: fadeIn.color || '#ffffff',
      height: fadeIn.height ?? 40,
    }
  }

  if (fadeOut) {
    sceneProps.fadeOut = {
      enabled: fadeOut.enabled ?? true,
      color: fadeOut.color || '#00675c',
      height: fadeOut.height ?? 40,
    }
  }

  if (overlayText?.text) {
    sceneProps.overlayText = {
      text: overlayText.text,
      positionX: overlayText.positionX ?? 50,
      positionY: overlayText.positionY ?? 50,
      font: (overlayText.font as OverlayTextFont) || 'display',
    }
  }

  if (spacing) {
    sceneProps.offsetTop = spacing.offsetTop ?? 0
    sceneProps.offsetBottom = spacing.offsetBottom ?? 0
  }

  return <SpacerScene {...sceneProps} />
}
