import type React from 'react'

export interface StatItemData {
  value: string
  label: string
  icon?: React.ReactNode
}

export type StatsDisplayMode = 'panel' | 'grid' | 'counters' | 'inline'

export type StatSize = 'sm' | 'md' | 'lg'
