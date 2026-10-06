'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CaptionOverlay } from './CaptionOverlay'
import { useFrameTracker } from './useFrameTracker'
import { useVideoDuration } from './useVideoDuration'
import type { CaptionEntry } from '../../captions/types'
import { PlayButton, PauseButton } from '../PlayButton'

interface VideoPlayerProps {
  videoSrc: string
  captions: CaptionEntry[]
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  showControls?: boolean
}

export default function VideoPlayer({
  videoSrc,
  captions,
  autoPlay = false,
  muted = false,
  loop = false,
  showControls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { fps, width, height } = useVideoDuration(videoSrc)
  const frame = useFrameTracker(videoRef, fps)

  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null)

  // Compute the actual rendered video area within the container (objectFit: contain)
  // In fullscreen, the container may be wider/taller than the video, causing letterboxing.
  const videoAspect = width && height ? width / height : 16 / 9
  const containerAspect = containerWidth && containerHeight ? containerWidth / containerHeight : videoAspect
  let videoRenderWidth = containerWidth
  let videoRenderHeight = containerHeight
  if (containerAspect > videoAspect) {
    // Container is wider — pillarboxing (black bars on sides)
    videoRenderWidth = containerHeight * videoAspect
  } else {
    // Container is taller — letterboxing (black bars top/bottom)
    videoRenderHeight = containerWidth / videoAspect
  }

  // Font scale: ratio of actual video render height to 1080p reference
  const REFERENCE_HEIGHT = 1080
  const scale = videoRenderHeight > 0 ? videoRenderHeight / REFERENCE_HEIGHT : 1

  // Brief fade-out when pause button appears after clicking play (showControls=false mode)
  const [showPauseFeedback, setShowPauseFeedback] = useState(false)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>(null)

  // Sync progress bar via timeupdate (cheaper than rAF for the scrubber)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      setProgress(video.currentTime)
      setDuration(video.duration || 0)
    }
    const onLoadedMetadata = () => setDuration(video.duration || 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('ended', onEnded)
    }
  }, [])

  // Track container height for caption font scaling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height)
      setContainerWidth(entry.contentRect.width)
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  // Fullscreen change tracking (standard + webkit prefix for Safari)
  useEffect(() => {
    const onChange = () => {
      const fsEl = document.fullscreenElement ?? (document as any).webkitFullscreenElement
      setIsFullscreen(!!fsEl)
    }
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  // Auto-hide controls after 3s of no mouse movement
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000)
  }, [])

  const handleToggle = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (playing) {
      video.pause()
    } else {
      video.play()
      if (!showControls) {
        setShowPauseFeedback(true)
        if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
        feedbackTimer.current = setTimeout(() => setShowPauseFeedback(false), 800)
      }
    }
  }, [playing, showControls])

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current
      if (!video || !duration) return
      const rect = e.currentTarget.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      video.currentTime = ratio * duration
    },
    [duration],
  )

  // TODO: restore detection after testing
  const canFullscreen = true

  const handleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const fsEl = document.fullscreenElement ?? (document as any).webkitFullscreenElement
    if (fsEl) {
      if (document.exitFullscreen) document.exitFullscreen()
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen()
    } else {
      if (container.requestFullscreen) container.requestFullscreen()
      else if ((container as any).webkitRequestFullscreen) (container as any).webkitRequestFullscreen()
    }
  }, [])

  const handleDoubleClick = useCallback(() => {
    if (showControls) handleFullscreen()
  }, [showControls, handleFullscreen])

  const showScrubber = showControls && playing && controlsVisible

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        aspectRatio: `${width}/${height}`,
        borderRadius: '0.8rem',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
      onMouseMove={showControls ? resetHideTimer : undefined}
      onDoubleClick={handleDoubleClick}
    >
      {/* Native video element */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />

      {/* Caption overlay — constrained to the actual video content area (not letterbox bars) */}
      {captions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            width: videoRenderWidth,
            height: videoRenderHeight,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          <CaptionOverlay captions={captions} frame={frame} fps={fps} scale={scale} />
        </div>
      )}

      {/* Clickable overlay for play/pause toggle */}
      {(!showControls || !playing) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '0.8rem',
          }}
          onClick={handleToggle}
        >
          {!playing && <PlayButton size={80} />}
        </div>
      )}

      {/* Controls bar (scrubber + fullscreen) */}
      {showScrubber && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            cursor: 'default',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress bar */}
          <div
            style={{
              flex: 1,
              height: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 2,
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={handleSeek}
          >
            <div
              style={{
                height: '100%',
                width: duration ? `${(progress / duration) * 100}%` : '0%',
                backgroundColor: '#fff',
                borderRadius: 2,
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          {/* Fullscreen button */}
          {canFullscreen && (
            <button
              type="button"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              onClick={handleFullscreen}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                {isFullscreen ? (
                  <>
                    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                  </>
                ) : (
                  <>
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Click overlay when playing with controls (for pause on click) */}
      {showControls && playing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            bottom: 40,
            cursor: 'pointer',
          }}
          onClick={handleToggle}
        />
      )}

      {/* Pause feedback — fades out immediately after clicking play (showControls=false) */}
      {showPauseFeedback && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            borderRadius: '0.8rem',
            opacity: 0,
            transition: 'opacity 0.5s ease-out 0.6s',
          }}
          ref={(el) => {
            if (el) {
              el.style.opacity = '1'
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  el.style.opacity = '0'
                })
              })
            }
          }}
        >
          <PauseButton size={80} />
        </div>
      )}
    </div>
  )
}
