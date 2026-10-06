'use client'

import { useState, useEffect } from 'react'

const DEFAULT_FPS = 30
const DEFAULT_DURATION_FRAMES = 300 // 10s fallback

interface VideoDurationResult {
  durationInFrames: number
  fps: number
  width: number
  height: number
  loading: boolean
}

/**
 * Detects video duration from a video URL using the browser's HTMLVideoElement API.
 * Falls back to default duration if metadata is unavailable.
 */
export function useVideoDuration(videoSrc: string | undefined): VideoDurationResult {
  const [result, setResult] = useState<VideoDurationResult>({
    durationInFrames: DEFAULT_DURATION_FRAMES,
    fps: DEFAULT_FPS,
    width: 1920,
    height: 1080,
    loading: true,
  })

  useEffect(() => {
    if (!videoSrc) {
      setResult((prev) => ({ ...prev, loading: false }))
      return
    }

    const video = document.createElement('video')
    video.src = videoSrc
    video.preload = 'metadata'

    const handleLoaded = () => {
      const duration = video.duration
      if (duration && isFinite(duration)) {
        setResult({
          durationInFrames: Math.ceil(duration * DEFAULT_FPS),
          fps: DEFAULT_FPS,
          width: video.videoWidth || 1920,
          height: video.videoHeight || 1080,
          loading: false,
        })
      } else {
        setResult((prev) => ({ ...prev, loading: false }))
      }
    }

    const handleError = () => {
      setResult((prev) => ({ ...prev, loading: false }))
    }

    video.addEventListener('loadedmetadata', handleLoaded)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded)
      video.removeEventListener('error', handleError)
      video.src = ''
    }
  }, [videoSrc])

  return result
}
