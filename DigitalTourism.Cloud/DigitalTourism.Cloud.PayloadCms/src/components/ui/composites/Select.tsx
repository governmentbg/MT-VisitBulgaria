'use client'

import { cn } from '@/components/ui/theme/cn'
import * as SelectPrimitive from '@radix-ui/react-select'
import {
  CheckmarkRegular,
  ChevronUpRegular,
  DismissRegular,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import * as React from 'react'

// ── Radix Select composition primitives ──

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger: React.FC<
  { ref?: React.Ref<HTMLButtonElement> } & React.ComponentProps<typeof SelectPrimitive.Trigger>
> = ({ children, className, ref, ...props }) => (
  <SelectPrimitive.Trigger
    className={cn(
      'flex w-full items-center justify-between rounded-xl border border-input-field-border bg-background p-4 text-sm font-medium font-sans transition-colors',
      'hover:border-grey-300 focus:outline-none focus:shadow-[0px_0px_4px_1px] focus:shadow-primary focus:border-primary',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'placeholder:text-input-field-placeholder [&>span]:line-clamp-1',
      className,
    )}
    ref={ref}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <SpriteIcon name="chevron-down" className="h-4 w-4 shrink-0 text-grey-400" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
)

const SelectScrollUpButton: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
> = ({ className, ref, ...props }) => (
  <SelectPrimitive.ScrollUpButton
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    ref={ref}
    {...props}
  >
    <ChevronUpRegular className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
)

const SelectScrollDownButton: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.ComponentProps<
    typeof SelectPrimitive.ScrollDownButton
  >
> = ({ className, ref, ...props }) => (
  <SelectPrimitive.ScrollDownButton
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    ref={ref}
    {...props}
  >
    <SpriteIcon name="chevron-down" className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
)

const SelectContent: React.FC<
  {
    ref?: React.Ref<HTMLDivElement>
  } & React.ComponentProps<typeof SelectPrimitive.Content>
> = ({ children, className, position = 'popper', ref, ...props }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-grey-100 bg-white text-popover-foreground shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      ref={ref}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'py-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
)

const SelectLabel: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.ComponentProps<typeof SelectPrimitive.Label>
> = ({ className, ref, ...props }) => (
  <SelectPrimitive.Label
    className={cn('py-1.5 px-4 text-sm font-semibold font-sans', className)}
    ref={ref}
    {...props}
  />
)

const SelectItem: React.FC<
  { ref?: React.Ref<HTMLDivElement>; value: string } & React.ComponentProps<
    typeof SelectPrimitive.Item
  >
> = ({ children, className, ref, ...props }) => (
  <SelectPrimitive.Item
    className={cn(
      'relative flex w-full cursor-default select-none items-center justify-between rounded-sm py-2.5 pl-6 pr-4 text-sm font-sans outline-none transition-colors hover:bg-grey-25 focus:bg-grey-25 data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-900 data-[state=checked]:font-medium data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    ref={ref}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

    <span className="ml-2 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckmarkRegular className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
)

const SelectSeparator: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.ComponentProps<typeof SelectPrimitive.Separator>
> = ({ className, ref, ...props }) => (
  <SelectPrimitive.Separator
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    ref={ref}
    {...props}
  />
)

// ── SimpleSelect: convenience wrapper ──

export interface SimpleSelectOption {
  label: string
  value: string
}

export interface SimpleSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options?: SimpleSelectOption[]
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  disabled?: boolean
  ref?: React.Ref<HTMLDivElement>
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({
  options = [],
  placeholder,
  value,
  onChange,
  onClear,
  disabled = false,
  className,
  ref,
  ...props
}) => {
  const hasValue = !!value
  const canClear = hasValue && !!onClear

  return (
    <div ref={ref} {...props}>
      <Select
        value={value}
        onValueChange={(val) => onChange?.(val)}
        disabled={disabled}
      >
        <div className="relative">
          <SelectTrigger className={cn(canClear && 'pr-10', className)}>
            <SelectValue placeholder={placeholder || 'Select...'} />
          </SelectTrigger>
          {canClear && (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
              onClick={(e) => {
                e.stopPropagation()
                onClear?.()
              }}
            >
              <DismissRegular className="h-4 w-4 shrink-0 text-grey-400 hover:text-grey-600" />
            </button>
          )}
        </div>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SimpleSelect,
}
