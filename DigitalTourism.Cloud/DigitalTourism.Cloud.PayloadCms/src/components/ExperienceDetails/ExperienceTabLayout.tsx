'use client'

import React, { useState, useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/components/ui'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

export interface ExperienceTabLayoutProps {
  tabs: TabItem[]
  className?: string
}

export const ExperienceTabLayout: React.FC<ExperienceTabLayoutProps> = ({
  tabs,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '')

  // Sync with URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && tabs.some((t) => t.id === hash)) {
      setActiveTab(hash)
    }
  }, [tabs])

  const handleTabClick = useCallback(
    (id: string) => {
      setActiveTab(id)
      window.history.replaceState(null, '', `#${id}`)
    },
    [],
  )

  return (
    <div className={cn(className)}>
      {/* Tab bar */}
      <div>
        <div className="container flex justify-center">
          <div className="flex w-full max-w-[1066px]">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  className={cn(
                    'flex-1 pt-4 pb-3 text-center text-base transition-colors md:text-lg lg:text-2xl',
                    isActive
                      ? 'border-b-2 border-primary-600 font-bold text-grey-600'
                      : 'font-medium text-grey-400 hover:text-grey-500',
                  )}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab panels — all rendered for SEO, hidden via CSS */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-hidden={!isActive}
            className={cn(isActive ? 'block' : 'hidden')}
          >
            {tab.content}
          </div>
        )
      })}
    </div>
  )
}
