import React from 'react'
import {
  GlobeRegular,
  BuildingRegular,
  StarRegular,
  CalendarLtrRegular,
} from '@/components/ui/icons'
import type { StatItemData } from './types'

export const figmaItems: StatItemData[] = [
  { value: '10', label: 'Обекти под закрила на UNESCO' },
  { value: '40,000+', label: 'Културни паметници' },
  { value: '250+', label: 'Музеи и галерии' },
  { value: '7,000+', label: 'Години история' },
]

export const countersItems: StatItemData[] = [
  { value: '60,000+', label: 'Места за настаняване', icon: <BuildingRegular /> },
  { value: '8.3 млн', label: 'Чуждестранни туристи', icon: <GlobeRegular /> },
  { value: '200+', label: 'Защитени природни обекта', icon: <StarRegular /> },
  { value: '7,000+', label: 'Години история', icon: <CalendarLtrRegular /> },
]

export const sampleImage = (
  <img
    src="https://images.unsplash.com/photo-1558642084-fd07fae5282e?w=1200&h=800&fit=crop"
    alt="Bulgarian old town"
    className="h-full w-full object-cover"
  />
)
