'use client'

import { interpolate } from './interpolate'
import { timeToFrame } from '../../captions/timeToFrame'
import type { CaptionEntry } from '../../captions/types'

interface CaptionOverlayProps {
  captions: CaptionEntry[]
  frame: number
  fps: number
  /** Scale factor derived from container height / reference height (1080) */
  scale: number
}

/** Base font sizes at 1080p reference height */
const fontSizeMap = {
  sm: 16,
  md: 24,
  lg: 36,
  xl: 48,
  '2xl': 64,
  '3xl': 96,
} as const

// next/font sets CSS variables with hashed font names; we reference the variables
// and add the real Google Fonts family names as fallbacks.
const fontFamilyMap = {
  sans: "var(--font-montserrat), 'Montserrat', sans-serif",
  heading: "var(--font-montserrat-alt), 'Montserrat Alternates', sans-serif",
  display: "var(--font-display), var(--font-montserrat-alt), 'Montserrat Alternates', sans-serif",
  mono: "var(--font-geist-mono), 'Geist Mono', monospace",
} as const

const fontWeightMap = {
  thin: 300,
  normal: 400,
  bold: 700,
  black: 900,
} as const

const textColorMap = {
  white: '#ffffff',
  black: '#000000',
  gold: '#fbbf24',
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
} as const

const bgMap = {
  dark: 'rgba(0, 0, 0, 0.35)',
  light: 'rgba(255, 255, 255, 0.3)',
  none: 'transparent',
} as const

const textShadowMap = {
  none: 'none',
  subtle: '0 1px 4px rgba(0,0,0,0.5)',
  strong: '0 2px 8px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.5)',
  outline: '-1px -1px 0 rgba(0,0,0,0.7), 1px -1px 0 rgba(0,0,0,0.7), -1px 1px 0 rgba(0,0,0,0.7), 1px 1px 0 rgba(0,0,0,0.7)',
} as const

const containerWidthMap = {
  narrow: '33%',
  medium: '50%',
  wide: '80%',
  full: '100%',
} as const

/** Frames used for enter/exit animations */
const ANIM_FRAMES = 15

function computePositionStyle(caption: CaptionEntry): React.CSSProperties {
  const width = containerWidthMap[caption.containerWidth ?? 'wide']

  // Manual x/y takes precedence over presets
  if (caption.x != null || caption.y != null) {
    return {
      width,
      left: `${caption.x ?? 50}%`,
      top: `${caption.y ?? 50}%`,
      transform: 'translate(-50%, -50%)',
    }
  }

  const vPos = caption.verticalPosition ?? 'bottom'
  const hAlign = caption.horizontalAlignment ?? 'center'

  const style: React.CSSProperties = { width }

  // Vertical
  if (vPos === 'top') style.top = '5%'
  else if (vPos === 'center') style.top = '50%'
  else style.bottom = '5%'

  // Horizontal
  if (hAlign === 'left') style.left = '2%'
  else if (hAlign === 'center') style.left = '50%'
  else style.right = '2%'

  // Transform for centering axes
  const tx = hAlign === 'center' ? '-50%' : '0'
  const ty = vPos === 'center' ? '-50%' : '0'
  if (tx !== '0' || ty !== '0') {
    style.transform = `translate(${tx}, ${ty})`
  }

  return style
}

interface AnimationResult {
  style: React.CSSProperties
  /** For typewriter: number of visible characters (undefined = show all) */
  visibleChars?: number
}

function computeAnimation(
  caption: CaptionEntry,
  frame: number,
  fps: number,
): AnimationResult {
  const animation = caption.animation ?? 'none'
  if (animation === 'none') return { style: {} }

  const startFrame = timeToFrame(caption.startTime, fps)
  const endFrame = timeToFrame(caption.endTime, fps)
  const duration = endFrame - startFrame
  const localFrame = frame - startFrame
  const animLen = Math.min(ANIM_FRAMES, Math.floor(duration / 2))

  // Typewriter: reveal characters one by one over the full duration
  if (animation === 'typewriter') {
    const totalChars = caption.text.length
    const revealFrames = Math.max(Math.floor(duration * 0.8), 1)
    const visibleChars = Math.min(
      totalChars,
      Math.floor(interpolate(localFrame, [0, revealFrames], [0, totalChars], {
        extrapolateRight: 'clamp',
      })),
    )
    return { style: {}, visibleChars }
  }

  let opacity = 1
  let translateY = 0
  let scale = 1

  switch (animation) {
    case 'fadeIn':
      opacity = interpolate(localFrame, [0, animLen], [0, 1], { extrapolateRight: 'clamp' })
      break
    case 'fadeOut':
      opacity = interpolate(localFrame, [duration - animLen, duration], [1, 0], {
        extrapolateLeft: 'clamp',
      })
      break
    case 'fadeInOut':
      opacity = interpolate(
        localFrame,
        [0, animLen, duration - animLen, duration],
        [0, 1, 1, 0],
      )
      break
    case 'slideUp':
      translateY = interpolate(localFrame, [0, animLen], [40, 0], { extrapolateRight: 'clamp' })
      opacity = interpolate(localFrame, [0, animLen], [0, 1], { extrapolateRight: 'clamp' })
      break
    case 'slideDown':
      translateY = interpolate(localFrame, [0, animLen], [-40, 0], { extrapolateRight: 'clamp' })
      opacity = interpolate(localFrame, [0, animLen], [0, 1], { extrapolateRight: 'clamp' })
      break
    case 'scale':
      scale = interpolate(localFrame, [0, animLen], [0.5, 1], { extrapolateRight: 'clamp' })
      opacity = interpolate(localFrame, [0, animLen], [0, 1], { extrapolateRight: 'clamp' })
      break
  }

  const style: React.CSSProperties = {}
  if (opacity !== 1) style.opacity = opacity
  if (translateY !== 0 || scale !== 1) {
    const parts: string[] = []
    if (translateY !== 0) parts.push(`translateY(${translateY}px)`)
    if (scale !== 1) parts.push(`scale(${scale})`)
    style.transform = parts.join(' ')
  }

  return { style }
}

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({ captions, frame, fps, scale }) => {

  const active = captions.filter((c) => {
    const startFrame = timeToFrame(c.startTime, fps)
    const endFrame = timeToFrame(c.endTime, fps)
    return frame >= startFrame && frame <= endFrame
  })

  if (active.length === 0) return null

  return (
    <>
      {active.map((caption, i) => {
        const fs = caption.fontSize ?? 'md'
        const ff = caption.fontFamily ?? 'sans'
        const fw = caption.fontWeight ?? 'normal'
        const color = caption.textColor ?? 'white'
        const shadow = caption.textShadow ?? 'none'
        const bg = caption.background ?? 'dark'
        const hAlign = caption.horizontalAlignment ?? 'center'

        const positionStyle = computePositionStyle(caption)
        const { style: animStyle, visibleChars } = computeAnimation(caption, frame, fps)

        // Merge animation transform with position transform
        const baseTransform = (positionStyle.transform as string) ?? ''
        const animTransform = (animStyle.transform as string) ?? ''
        const combinedTransform =
          [baseTransform, animTransform].filter(Boolean).join(' ') || undefined

        const displayText =
          visibleChars !== undefined ? caption.text.slice(0, visibleChars) : caption.text

        // Show blinking cursor for typewriter while still revealing
        const showCursor =
          visibleChars !== undefined && visibleChars < caption.text.length

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              display: 'flex',
              justifyContent:
                hAlign === 'left'
                  ? 'flex-start'
                  : hAlign === 'right'
                    ? 'flex-end'
                    : 'center',
              pointerEvents: 'none',
              ...positionStyle,
              ...animStyle,
              transform: combinedTransform,
            }}
          >
            <span
              style={{
                fontSize: fontSizeMap[fs] * scale,
                fontFamily: fontFamilyMap[ff],
                fontWeight: fontWeightMap[fw],
                color: textColorMap[color],
                backgroundColor: bgMap[bg],
                backdropFilter: bg !== 'none' ? `blur(${Math.max(2, 8 * scale)}px)` : undefined,
                WebkitBackdropFilter: bg !== 'none' ? `blur(${Math.max(2, 8 * scale)}px)` : undefined,
                padding: `${fontSizeMap[fs] * scale * 0.2}px ${fontSizeMap[fs] * scale * 0.5}px`,
                borderRadius: Math.max(4, 6 * scale),
                textAlign:
                  hAlign === 'center' ? 'center' : hAlign === 'right' ? 'right' : 'left',
                lineHeight: 1.2,
                letterSpacing: fs === '2xl' || fs === '3xl' ? '0.02em' : undefined,
                textShadow: shadow !== 'none' ? textShadowMap[shadow] : undefined,
                filter: `blur(${0.6 * scale}px)`,
                display: 'block',
                width: '100%',
                maxWidth: '100%',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {displayText}
              {showCursor && (
                <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>|</span>
              )}
            </span>
          </div>
        )
      })}
    </>
  )
}
