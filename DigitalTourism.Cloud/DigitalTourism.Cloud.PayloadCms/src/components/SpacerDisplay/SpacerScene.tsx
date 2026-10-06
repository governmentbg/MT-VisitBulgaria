import React from 'react'
import { cn } from '@/components/ui'
import { SpacerGradient } from './SpacerGradient'
import { SpacerOverlayText } from './SpacerOverlayText'
import type { SpacerSceneProps } from './types'

export const SpacerScene: React.FC<SpacerSceneProps> = ({
  image,
  alt = '',
  height = '60vh',
  fadeIn,
  fadeOut,
  overlayText,
  offsetTop = 0,
  offsetBottom = 0,
  className,
}) => {
  return (
    <div
      className={cn('relative w-full overflow-hidden z-0 -my-16', className)}
      style={{
        height,
        marginTop: offsetTop === 0 ? undefined : `${offsetTop}px`,
        marginBottom: offsetBottom === 0 ? undefined : `${offsetBottom}px`,
      }}
    >
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {fadeIn?.enabled && (
        <SpacerGradient position="top" color={fadeIn.color} heightPercent={fadeIn.height} />
      )}

      {fadeOut?.enabled && (
        <SpacerGradient position="bottom" color={fadeOut.color} heightPercent={fadeOut.height} />
      )}

      {overlayText?.text && (
        <SpacerOverlayText
          text={overlayText.text}
          positionX={overlayText.positionX}
          positionY={overlayText.positionY}
          font={overlayText.font}
          fontSize={overlayText.fontSize}
        />
      )}
    </div>
  )
}
