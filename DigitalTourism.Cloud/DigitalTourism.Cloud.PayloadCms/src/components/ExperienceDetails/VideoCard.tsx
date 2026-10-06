'use client'

import React, { useState } from 'react'
import { cn } from '@/components/ui'

export interface VideoCardProps {
  thumbnailUrl: string | null
  title?: string | null
  provider: 'youtube' | 'vimeo' | null
  videoId: string | null
  onClick?: () => void
}

export const VideoCard: React.FC<VideoCardProps> = ({
  thumbnailUrl,
  title,
  provider,
  videoId,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false)

  const fallbackThumbnail =
    provider === 'youtube' && videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null

  const imgSrc = imgError && fallbackThumbnail ? fallbackThumbnail : thumbnailUrl

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full cursor-pointer flex-col items-start overflow-hidden rounded-3xl',
        'border border-grey-100 bg-white text-left shadow-lg',
        'transition-shadow hover:shadow-xl',
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-grey-50">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title ?? ''}
            loading="lazy"
            onError={() => {
              if (!imgError) setImgError(true)
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-grey-100">
            <PlayIcon className="size-12 text-grey-400" />
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform group-hover:scale-110">
            <PlayIcon className="ml-1 size-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Card bottom */}
      {title && (
        <div className="flex w-full flex-col gap-1.5 p-5">
          <p className="line-clamp-2 font-heading text-xl font-bold text-grey-900">{title}</p>
        </div>
      )}
    </button>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
