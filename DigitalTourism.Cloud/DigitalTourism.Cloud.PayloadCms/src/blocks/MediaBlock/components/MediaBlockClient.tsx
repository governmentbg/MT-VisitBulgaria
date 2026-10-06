'use client'

import { lazy, Suspense, useEffect, useState } from 'react'
import type { CaptionEntry } from '../captions/types'

const VideoPlayer = lazy(() => import('./VideoPlayer'))
const EmbedPlayer = lazy(() => import('./EmbedPlayer'))

interface MediaBlockClientProps {
  isEmbed: boolean
  embedUrl?: string
  videoSrc?: string
  captions: CaptionEntry[]
  autoPlay: boolean
  muted: boolean
  loop: boolean
  showControls: boolean
}

export function MediaBlockClient(props: MediaBlockClientProps) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  if (!isClient) return null

  if (props.isEmbed && props.embedUrl) {
    return (
      <Suspense>
        <EmbedPlayer url={props.embedUrl} />
      </Suspense>
    )
  }

  if (props.videoSrc) {
    return (
      <Suspense>
        <VideoPlayer
          videoSrc={props.videoSrc}
          captions={props.captions}
          autoPlay={props.autoPlay}
          muted={props.muted}
          loop={props.loop}
          showControls={props.showControls}
        />
      </Suspense>
    )
  }

  return null
}
