'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
  SkeletonImage,
  SkeletonButton,
  SkeletonLabel,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

/** Pill placeholder (category tag) */
const Pill: React.FC = () => (
  <div
    style={{
      width: '40px',
      height: '14px',
      backgroundColor: 'var(--theme-elevation-150)',
      borderRadius: '8px',
    }}
  />
)

/** Standard vertical card: image top with pill, then title, description, location, CTA */
const StandardCard: React.FC = () => (
  <div
    style={{
      border: '1px dashed var(--theme-elevation-200)',
      borderRadius: '8px',
      overflow: 'hidden',
      flex: 1,
    }}
  >
    <div style={{ position: 'relative' }}>
      <SkeletonImage height="64px" style={{ borderRadius: 0 }} />
      <div style={{ position: 'absolute', top: '6px', left: '6px' }}>
        <Pill />
      </div>
    </div>
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <SkeletonLine width="75%" height="10px" />
      <SkeletonLine width="95%" height="7px" />
      <SkeletonLine width="45%" height="7px" />
      <SkeletonButton width="100%" />
    </div>
  </div>
)

/** Overlay card: full-height image with pill at top and text overlaid at bottom */
const OverlayCard: React.FC = () => (
  <div
    style={{
      flex: 1,
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative',
      minHeight: '110px',
    }}
  >
    <SkeletonImage height="100%" style={{ borderRadius: 0, position: 'absolute', inset: 0, minHeight: '110px' }} />
    <div style={{ position: 'absolute', top: '6px', left: '6px' }}>
      <Pill />
    </div>
    <div
      style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        right: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <SkeletonLine width="65%" height="10px" />
      <SkeletonLine width="85%" height="7px" />
      <SkeletonButton width="56px" />
    </div>
  </div>
)

/** Horizontal card: two columns — text left, image right */
const HorizontalCard: React.FC = () => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      border: '1px dashed var(--theme-elevation-200)',
      borderRadius: '8px',
      overflow: 'hidden',
      minHeight: '90px',
    }}
  >
    <div
      style={{
        flex: 1,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        justifyContent: 'center',
      }}
    >
      <Pill />
      <SkeletonLine width="80%" height="10px" />
      <SkeletonLine width="100%" height="7px" />
      <SkeletonLine width="40%" height="7px" />
    </div>
    <div style={{ flex: 1 }}>
      <SkeletonImage height="100%" style={{ borderRadius: 0, minHeight: '90px' }} />
    </div>
  </div>
)

const HeaderRow: React.FC<{ centered?: boolean; withViewAll?: boolean }> = ({
  centered = false,
  withViewAll = false,
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: centered ? 'center' : 'space-between',
      alignItems: 'flex-start',
      gap: '8px',
      marginBottom: '8px',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: centered ? 'center' : 'flex-start',
      }}
    >
      <SkeletonLine width="180px" height="12px" />
      <SkeletonLine width="240px" height="8px" />
    </div>
    {withViewAll && <SkeletonButton width="64px" />}
  </div>
)

const SearchBar: React.FC = () => (
  <div
    style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '8px',
      padding: '6px',
      border: '1px solid var(--theme-elevation-200)',
      borderRadius: '4px',
      alignItems: 'center',
    }}
  >
    <SkeletonLine width="70%" height="10px" />
    <SkeletonButton width="56px" />
  </div>
)

const Arrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontSize: '16px', color: 'var(--theme-elevation-300)', flexShrink: 0 }}>
    {children}
  </span>
)

const NavDots: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: i === 0 ? 'var(--theme-elevation-400)' : 'var(--theme-elevation-200)',
        }}
      />
    ))}
  </div>
)

export const ExperienceListingPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const displayMode = (getDataByPath('displayMode') as string) || 'grid'
  const itemsPerPage = (getDataByPath('itemsPerPage') as number) || 6
  const showAdvancedSearch = (getDataByPath('showAdvancedSearch') as boolean) || false
  const showFilters = (getDataByPath('showFilters') as boolean) || false
  const showSearchBar = showAdvancedSearch || showFilters

  return (
    <BlockPreviewShell blockSlug="experienceListing">
      <SkeletonWrapper>
        {showSearchBar && <SearchBar />}

        {/* Grid: 3-column, 2 rows */}
        {displayMode === 'grid' && (
          <>
            <HeaderRow withViewAll />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <StandardCard key={i} />
              ))}
            </div>
          </>
        )}

        {/* Carousel Standard: header + arrows + 3 standard cards */}
        {displayMode === 'carouselStandard' && (
          <>
            <HeaderRow withViewAll />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Arrow>&larr;</Arrow>
              <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <StandardCard key={i} />
                ))}
              </div>
              <Arrow>&rarr;</Arrow>
            </div>
            <NavDots />
          </>
        )}

        {/* Carousel Overlay: header left + arrows + 2 overlay cards */}
        {displayMode === 'carouselOverlay' && (
          <>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <SkeletonLine width="90%" height="12px" />
                <SkeletonLine width="100%" height="8px" />
                <SkeletonLine width="70%" height="8px" />
                <NavDots />
              </div>
              <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                <OverlayCard />
                <OverlayCard />
              </div>
            </div>
          </>
        )}

        {/* Carousel Horizontal: centered header + 2 horizontal cards + dots */}
        {displayMode === 'carouselHorizontal' && (
          <>
            <HeaderRow centered />
            <div style={{ display: 'flex', gap: '8px' }}>
              <HorizontalCard />
              <HorizontalCard />
            </div>
            <NavDots />
          </>
        )}

        <div
          style={{
            marginTop: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <SkeletonLabel text={displayMode} />
          <SkeletonLabel text={`Items: ${itemsPerPage}`} />
        </div>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
