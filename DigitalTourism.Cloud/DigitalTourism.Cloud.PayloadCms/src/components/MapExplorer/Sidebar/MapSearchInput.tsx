'use client'

import { Input } from '@/components/ui/primitives/Input'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { DismissRegular } from '@/components/ui/icons'

interface MapSearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
}

export function MapSearchInput({ value, onChange, onClear, placeholder }: MapSearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      leftIcon={<SpriteIcon name="search" className="h-4 w-4" />}
      rightIcon={
        value ? (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center justify-center text-grey-400 hover:text-grey-600"
            aria-label="Clear search"
          >
            <DismissRegular className="h-4 w-4" />
          </button>
        ) : undefined
      }
      className="rounded-xl border-grey-200 bg-white"
    />
  )
}
