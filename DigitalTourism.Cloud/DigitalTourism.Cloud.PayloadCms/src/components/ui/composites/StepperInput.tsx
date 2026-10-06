'use client'

import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import * as React from 'react'

export interface StepperInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string
  value: string | number
  onIncrement?: () => void
  onDecrement?: () => void
  onChange?: (value: string) => void
  disabled?: boolean
  ref?: React.Ref<HTMLDivElement>
}

const StepperInput: React.FC<StepperInputProps> = ({
  label,
  value,
  onIncrement,
  onDecrement,
  onChange,
  disabled = false,
  className,
  ref,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5" ref={ref} {...props}>
      {label && (
        <label className="text-xs font-bold text-input-field-label font-sans">
          {label}
        </label>
      )}
      <div
        className={cn(
          'inline-flex items-center rounded-xl border border-input-field-border bg-background transition-colors',
          'hover:border-grey-300 focus-within:shadow-[0px_0px_4px_1px] focus-within:shadow-primary focus-within:border-primary',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <button
          type="button"
          aria-label="Decrement"
          disabled={disabled}
          onClick={onDecrement}
          className="flex h-full items-center justify-center px-3 py-3 text-grey-500 transition-colors hover:text-grey-900 disabled:pointer-events-none"
        >
          <SpriteIcon name="chevron-left" className="h-4 w-4" />
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full min-w-0 flex-1 bg-transparent py-3 text-center text-sm font-medium font-sans outline-none placeholder:text-input-field-placeholder disabled:cursor-not-allowed"
        />
        <button
          type="button"
          aria-label="Increment"
          disabled={disabled}
          onClick={onIncrement}
          className="flex h-full items-center justify-center px-3 py-3 text-grey-500 transition-colors hover:text-grey-900 disabled:pointer-events-none"
        >
          <SpriteIcon name="chevron-right" className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export { StepperInput }
