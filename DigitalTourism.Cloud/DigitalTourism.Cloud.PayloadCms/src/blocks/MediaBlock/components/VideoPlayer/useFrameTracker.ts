'use client'

import { useState, useEffect, type RefObject } from 'react'

export function useFrameTracker(
  videoRef: RefObject<HTMLVideoElement | null>,
  fps: number,
): number {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    let rafId: number

    const tick = () => {
      const video = videoRef.current
      if (video) {
        const newFrame = Math.floor(video.currentTime * fps)
        setFrame((prev) => (prev !== newFrame ? newFrame : prev))
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [videoRef, fps])

  return frame
}
