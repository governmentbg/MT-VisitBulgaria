'use client'

import React, { useRef, useEffect } from 'react'
import { cn } from '@/components/ui'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface ParallaxImageProps {
  media?: number | MediaType | null
  containerClassName?: string
  imgClassName?: string
  aspectRatio?: string
}

/**
 * Renders identically to a normal Media image on SSR and mobile.
 * On desktop, JS promotes the <picture> to absolute + oversized for a 20% parallax.
 */
export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  media,
  containerClassName,
  imgClassName,
  aspectRatio,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Find the <picture> or <img> rendered by <Media>
    const picture = container.querySelector('picture') || container.querySelector('img')
    if (!picture) return

    const el = picture as HTMLElement

    // Promote to absolute + oversized
    el.style.position = 'absolute'
    el.style.inset = '0'
    el.style.top = '-25%'
    el.style.height = '150%'
    el.style.width = '100%'
    el.style.willChange = 'transform'

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        const viewH = window.innerHeight
        const progress = 1 - rect.bottom / (viewH + rect.height)
        const shift = (progress - 0.5) * rect.height * 0.5
        el.style.transform = `translateY(${shift}px)`
        ticking = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', containerClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Media
        fill
        imgClassName={cn('object-cover', imgClassName)}
        resource={media}
        preferredSize="large"
        usePayloadSizes
      />
    </div>
  )
}
