'use client'

import React, { useRef, useEffect } from 'react'
import { cn } from '@/components/ui'

interface WaveDecorationProps {
  className?: string
}

const CONTAINER_HEIGHT = 'h-[10rem] mob-ls:h-[6rem] md:h-[11.25rem] lg:h-[15rem]'
const LAYER_HEIGHT = 'h-[16.25rem] mob-ls:h-[10rem] md:h-[18.75rem] lg:h-[25rem]'

export const WaveDecoration: React.FC<WaveDecorationProps> = ({ className }) => {
  const backLayer = useRef<HTMLDivElement>(null)
  const midLayer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const scrollY = window.scrollY
        if (backLayer.current) backLayer.current.style.transform = `translateY(${scrollY * -0.15}px)`
        if (midLayer.current) midLayer.current.style.transform = `translateY(${scrollY * -0.08}px)`
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={cn('pointer-events-none overflow-hidden', CONTAINER_HEIGHT, className)} aria-hidden="true">
      {/* Back layer — moves fastest */}
      <div ref={backLayer} className="absolute inset-x-0 top-0 will-change-transform">
        {/* Mobile: gentle, single soft curve */}
        <svg viewBox="0 0 430 200" preserveAspectRatio="none" className={cn('block w-full md:hidden', LAYER_HEIGHT)}>
          <path d="M0 70C60 95 130 55 215 80C300 105 370 65 430 85V200H0Z" fill="white" fillOpacity="0.3" />
        </svg>
        {/* Desktop: dramatic, multiple peaks */}
        <svg viewBox="0 0 1920 200" preserveAspectRatio="none" className={cn('hidden md:block w-full', LAYER_HEIGHT)}>
          <path d="M0 80C320 130 480 20 720 50C960 80 1200 130 1440 70C1600 30 1760 80 1920 50V200H0Z" fill="white" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Middle layer — moves slower */}
      <div ref={midLayer} className="absolute inset-x-0 top-0 will-change-transform">
        <svg viewBox="0 0 430 200" preserveAspectRatio="none" className={cn('block w-full md:hidden', LAYER_HEIGHT)}>
          <path d="M0 95C80 70 170 105 260 75C350 50 400 90 430 80V200H0Z" fill="white" fillOpacity="0.5" />
        </svg>
        <svg viewBox="0 0 1920 200" preserveAspectRatio="none" className={cn('hidden md:block w-full', LAYER_HEIGHT)}>
          <path d="M0 100C240 50 480 120 720 90C960 60 1200 120 1440 100C1680 80 1800 110 1920 85V200H0Z" fill="white" fillOpacity="0.5" />
        </svg>
      </div>

      {/* Front layer — stays fixed */}
      <div className="absolute inset-x-0 top-0">
        <svg viewBox="0 0 430 200" preserveAspectRatio="none" className={cn('block w-full md:hidden', LAYER_HEIGHT)}>
          <path d="M0 85C100 100 180 65 280 90C360 108 410 75 430 90V200H0Z" fill="white" />
        </svg>
        <svg viewBox="0 0 1920 200" preserveAspectRatio="none" className={cn('hidden md:block w-full', LAYER_HEIGHT)}>
          <path d="M0 120C320 90 640 135 960 110C1280 85 1600 125 1920 100V200H0Z" fill="white" />
        </svg>
      </div>
    </div>
  )
}
