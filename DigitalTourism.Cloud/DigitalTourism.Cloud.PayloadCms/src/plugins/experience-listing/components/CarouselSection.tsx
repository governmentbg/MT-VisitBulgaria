'use client'

import React from 'react'
import { cn } from '@/components/ui'
import type { SectionVariant, DisplayMode } from '../types'

type CarouselDisplayMode = Exclude<DisplayMode, 'grid'>
type DecorationImage = 'none' | 'watermark' | 'horizontalWatermark'

type BackgroundShape = 'full' | 'cutLeft' | 'cutRight'

interface CarouselSectionProps {
  displayMode: CarouselDisplayMode
  sectionVariant?: SectionVariant
  decorationImage?: DecorationImage
  decorationAlignment?: 'left' | 'right'
  backgroundShape?: BackgroundShape
  children: React.ReactNode
  className?: string
  isLoading?: boolean
}

const bgClasses: Record<SectionVariant, string> = {
  dark: 'bg-primary-900',
  darkAlt: 'bg-primary-800',
  teal: 'bg-[#b0eae4]',
  light: '',
}

const radiusClasses: Record<CarouselDisplayMode, Record<SectionVariant, string>> = {
  carouselStandard: {
    dark: 'rounded-[3rem]',
    darkAlt: 'rounded-[3rem]',
    teal: 'rounded-bl-[47px] rounded-br-[250px] rounded-tl-[47px] rounded-tr-[47px]',
    light: '',
  },
  carouselOverlay: {
    dark: '',
    darkAlt: '',
    teal: '',
    light: '',
  },
  carouselHorizontal: {
    dark: 'md:rounded-br-[3.75rem] lg:rounded-br-[10rem]',
    darkAlt: 'md:rounded-br-[3.75rem] lg:rounded-br-[10rem]',
    teal: 'md:rounded-br-[3.75rem] lg:rounded-br-[10rem]',
    light: '',
  },
}

const _isDarkVariant = (v: SectionVariant) => v === 'dark' || v === 'darkAlt'

type DecorationAlignment = 'left' | 'right'

const Decoration: React.FC<{
  image: DecorationImage
  variant: SectionVariant
  alignment?: DecorationAlignment
}> = ({ image, variant, alignment = 'left' }) => {
  if (image === 'none' || variant === 'light') return null

  const isRight = alignment === 'right'

  if (image === 'horizontalWatermark') {
    return (
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="container relative mx-auto h-full">
          <div
            className={cn(
              'absolute top-[20%] aspect-[2017/1804] w-[clamp(30rem,100vh,120rem)] opacity-20',
              isRight ? 'right-0' : 'left-0',
            )}
            style={{
              backgroundImage: 'url(/decorations/horizontal-carousel-watermark.svg)',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              transform: isRight ? 'translateX(30%) scaleX(-1)' : 'translateX(-30%)',
            }}
          />
        </div>
      </div>
    )
  }

  // watermark
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="container relative mx-auto h-full">
        <img
          src="/watermark.svg"
          alt=""
          aria-hidden
          className={cn(
            'absolute top-[20%] w-[clamp(16rem,55vh,44rem)] opacity-10',
            isRight ? '-right-[20%]' : '-left-[40%]',
          )}
        />
      </div>
    </div>
  )
}

export const CarouselSection: React.FC<CarouselSectionProps> = ({
  displayMode,
  sectionVariant = 'light',
  decorationImage = 'none',
  decorationAlignment = 'left',
  backgroundShape = 'full',
  children,
  className,
  isLoading,
}) => {
  const loadingClass = isLoading
    ? 'opacity-70 transition-opacity duration-200'
    : 'transition-opacity duration-200'

  const isLight = sectionVariant === 'light'
  const bg = isLight ? '' : bgClasses[sectionVariant]
  const isCut = !isLight && (backgroundShape === 'cutLeft' || backgroundShape === 'cutRight')
  const cutRadius =
    backgroundShape === 'cutLeft'
      ? 'rounded-[2.9375rem] rounded-bl-[12.5rem]'
      : backgroundShape === 'cutRight'
        ? 'rounded-[2.9375rem] rounded-br-[12.5rem]'
        : ''
  const radius = isCut ? cutRadius : radiusClasses[displayMode][sectionVariant]

  // When using a cut shape, wrap in a max-w-[1920px] container that clips the bg + cards
  // but let decorations overflow via a separate layer
  const wrapCut = (content: React.ReactNode, decoration: React.ReactNode, innerClass: string) => {
    if (!isCut) return null
    return (
      <div className={cn('relative', loadingClass, className)}>
        {/* Background shape — clipped */}
        <div
          className={cn(
            'absolute inset-0 z-[1] mx-auto max-w-[1920px] overflow-hidden',
            bg,
            radius,
          )}
        />
        {/* Decoration — clip horizontally only so watermarks can overflow vertically */}
        <div className="pointer-events-none absolute inset-0 z-[2]" style={{ overflowX: 'clip' }}>
          {decoration}
        </div>
        {/* Content — above everything, clipped to shape */}
        <div className={cn('relative z-[3] mx-auto max-w-[1920px] overflow-hidden', innerClass)}>
          {content}
        </div>
      </div>
    )
  }

  const decoration = isLight ? null : (
    <Decoration image={decorationImage} variant={sectionVariant} alignment={decorationAlignment} />
  )

  if (displayMode === 'carouselOverlay') {
    if (isCut) return wrapCut(children, decoration, 'py-16')!
    return (
      <div
        className={cn('relative', bg, 'py-16', radius, loadingClass, className)}
        style={{ overflowX: 'clip' }}
      >
        {decoration}
        <div className="relative">{children}</div>
      </div>
    )
  }

  if (displayMode === 'carouselHorizontal') {
    if (isCut) return wrapCut(children, decoration, 'py-16 px-8 lg:py-20')!
    return (
      <div className="relative" style={{ overflowX: 'clip' }}>
        <div
          className={cn(
            'relative',
            bg,
            'py-16  px-8 lg:px-0 lg:py-20',
            radius,
            loadingClass,
            className,
          )}
        >
          {decoration}
          <div className="relative">{children}</div>
        </div>
      </div>
    )
  }

  // carouselStandard
  if (isCut) return wrapCut(children, decoration, 'py-12 md:py-20')!
  return (
    <section
      className={cn(
        'relative mx-auto w-1920px',
        bg,
        radius,
        'py-12md:py-20',
        loadingClass,
        className,
      )}
      style={{ overflowX: 'clip' }}
    >
      {decoration}
      <div className="relative">{children}</div>
    </section>
  )
}
