'use client'

import React from 'react'
import { SvgMapDisplay, type SvgMapDisplayRegion } from '@/components/SvgMapDisplay'

interface SvgMapClientProps {
  heading: string
  subtitle?: string
  svgUrl: string
  backgroundImageUrl?: string
  regions: SvgMapDisplayRegion[]
  defaultRegionIndex: number
}

export const SvgMapClient: React.FC<SvgMapClientProps> = (props) => {
  return <SvgMapDisplay {...props} />
}
