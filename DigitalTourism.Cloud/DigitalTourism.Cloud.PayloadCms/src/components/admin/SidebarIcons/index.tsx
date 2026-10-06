'use client'
import React from 'react'
import { Hotel, UtensilsCrossed, PersonStanding, FerrisWheel } from 'lucide-react'
import { SidebarIconProvider } from 'payload-sidebar-plugin/components'

const icons = {
  'hotel': Hotel,
  'utensils-crossed': UtensilsCrossed,
  'person-standing': PersonStanding,
  'ferris-wheel': FerrisWheel,
}

export const SidebarIcons: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SidebarIconProvider icons={icons}>{children}</SidebarIconProvider>
}
