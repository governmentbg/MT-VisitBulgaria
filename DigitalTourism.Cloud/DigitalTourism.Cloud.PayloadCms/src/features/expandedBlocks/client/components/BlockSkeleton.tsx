'use client'

import React from 'react'

const baseColor = 'var(--theme-elevation-150)'
const accentColor = 'var(--theme-elevation-200)'
const textColor = 'var(--theme-elevation-400)'

export const SkeletonLine: React.FC<{
  width?: string
  height?: string
  style?: React.CSSProperties
}> = ({ width = '100%', height = '10px', style }) => (
  <div
    style={{
      width,
      height,
      backgroundColor: baseColor,
      borderRadius: '4px',
      ...style,
    }}
  />
)

export const SkeletonImage: React.FC<{
  width?: string
  height?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}> = ({ width = '100%', height = '60px', style, children }) => (
  <div
    style={{
      width,
      height,
      backgroundColor: accentColor,
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: textColor,
      fontSize: '0.7rem',
      ...style,
    }}
  >
    {children}
  </div>
)

export const SkeletonButton: React.FC<{ width?: string }> = ({ width = '64px' }) => (
  <div
    style={{
      width,
      height: '24px',
      backgroundColor: accentColor,
      borderRadius: '12px',
    }}
  />
)

export const SkeletonCard: React.FC<{
  style?: React.CSSProperties
}> = ({ style }) => (
  <div
    style={{
      border: `1px solid ${accentColor}`,
      borderRadius: '6px',
      overflow: 'hidden',
      ...style,
    }}
  >
    <SkeletonImage height="40px" />
    <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <SkeletonLine width="70%" />
      <SkeletonLine width="50%" height="8px" />
    </div>
  </div>
)

export const SkeletonGrid: React.FC<{
  columns?: number
  count?: number
  children?: React.ReactNode
}> = ({ columns = 3, count = 3, children }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '8px',
    }}
  >
    {children ||
      Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
)

export const SkeletonWrapper: React.FC<{
  children: React.ReactNode
  style?: React.CSSProperties
}> = ({ children, style }) => (
  <div
    style={{
      padding: '10px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      ...style,
    }}
  >
    {children}
  </div>
)

export const SkeletonIcon: React.FC<{
  Icon: React.FC<{ size?: number; strokeWidth?: number; color?: string }>
  size?: number
}> = ({ Icon, size = 32 }) => (
  <Icon size={size} strokeWidth={1.5} color={textColor} />
)

export const SkeletonLabel: React.FC<{ text: string }> = ({ text }) => (
  <span
    style={{
      fontSize: '0.7rem',
      color: textColor,
      fontStyle: 'italic',
    }}
  >
    {text}
  </span>
)
