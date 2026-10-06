'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState, useRef, useEffect } from 'react'
import { GlobeFilled } from '@/components/ui/icons'
import { LanguageOverlay } from './LanguageOverlay'
import { figmaDesign } from '../../theme/figma'

const meta = {
  title: 'Composites/Navigation/LanguageOverlay',
  component: LanguageOverlay,
  parameters: { layout: 'padded', ...figmaDesign('1335:9894') },
} satisfies Meta<typeof LanguageOverlay>

export default meta
type Story = StoryObj<typeof meta>

const locales = ['bg', 'en', 'de', 'fr', 'ru']

const InteractiveOverlay = () => {
  const [current, setCurrent] = useState('bg')
  return (
    <LanguageOverlay
      locales={locales}
      current={current}
      onChange={setCurrent}
    />
  )
}

const InteractiveSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState('bg')
  const containerRef = useRef<HTMLDivElement>(null)

  const handleChange = (locale: string) => {
    setCurrent(locale)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex size-12 items-center justify-center rounded-full p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          isOpen
            ? 'bg-primary-700 text-white'
            : 'bg-grey-100 text-grey-600 hover:bg-grey-200'
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <GlobeFilled className="size-4" />
      </button>

      {isOpen && (
        <LanguageOverlay
          locales={locales}
          current={current}
          onChange={handleChange}
          className="absolute right-0 top-full mt-2 z-50 shadow-lg"
        />
      )}
    </div>
  )
}

export const Showcase: Story = {
  args: { locales: [], current: '', onChange: () => {} },
  render: () => (
    <div className="flex flex-col gap-10 max-w-3md">
      <div>
        <h2 className="text-h4 font-semibold">LanguageOverlay</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Language selector dropdown with flag icons.
        </p>
      </div>

      <div className="flex gap-12 items-start">
        {/* Overlay standalone */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">Overlay</p>
          <InteractiveOverlay />
        </div>

        {/* Switcher with globe trigger */}
        <div className="flex flex-col gap-2 items-end">
          <p className="text-xs text-muted-foreground">Switcher (click globe)</p>
          <InteractiveSwitcher />
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    locales,
    current: 'bg',
    onChange: () => {},
  },
}
