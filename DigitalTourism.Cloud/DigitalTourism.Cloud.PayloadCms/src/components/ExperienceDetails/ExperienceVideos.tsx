'use client'

import React, { useState, useCallback } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import type { RenderSlideProps } from 'yet-another-react-lightbox'
import { lightboxRender } from '@/components/ui/lightboxRender'
import { CarouselShell } from '@/components/CarouselShell'
import { VideoCard } from './VideoCard'

export interface VideoWithMeta {
  id?: string | null
  title?: string | null
  url: string
  thumbnailUrl: string | null
  embedUrl: string | null
  provider: 'youtube' | 'vimeo' | null
  videoId: string | null
}

interface ExperienceVideosProps {
  videos: VideoWithMeta[]
}

function renderVideoSlide({ slide, offset, rect }: RenderSlideProps) {
  const embedUrl = (slide as { embedUrl?: string }).embedUrl
  if (!embedUrl) return undefined

  const width = Math.min(rect.width, 1280)
  const height = width * (9 / 16)

  // Only load the iframe for the currently active slide to prevent all videos playing at once
  if (offset !== 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={slide.src}
          alt=""
          width={width}
          height={height}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <iframe
        src={`${embedUrl}?autoplay=1`}
        width={width}
        height={height}
        style={{ maxWidth: '100%', maxHeight: '100%', border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        title="Video player"
      />
    </div>
  )
}

const lightboxPlugins = [Counter]

export const ExperienceVideos: React.FC<ExperienceVideosProps> = ({ videos }) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  if (!videos || videos.length === 0) return null

  // Build slides for the lightbox — use `src` as required by SlideImage,
  // set it to the thumbnail for poster display, and attach embedUrl for the custom renderer.
  const slides = videos
    .filter((v) => v.embedUrl)
    .map((v) => ({
      src: v.thumbnailUrl ?? v.embedUrl!,
      embedUrl: v.embedUrl!,
    }))

  return (
    <>
      <CarouselShell
        slideClassName="basis-[85%] sm:basis-[45%] lg:basis-1/3"
        showProgress={false}
      >
        {videos.map((video, index) => (
          <VideoCard
            key={video.id ?? index}
            thumbnailUrl={video.thumbnailUrl}
            title={video.title}
            provider={video.provider}
            videoId={video.videoId}
            onClick={() => openLightbox(index)}
          />
        ))}
      </CarouselShell>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        plugins={lightboxPlugins}
        render={{ ...lightboxRender, slide: renderVideoSlide }}
        controller={{ closeOnPullDown: true }}
      />
    </>
  )
}
