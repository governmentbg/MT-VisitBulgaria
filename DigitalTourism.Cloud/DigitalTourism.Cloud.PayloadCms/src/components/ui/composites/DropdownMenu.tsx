'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '@/components/ui/theme/cn'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  ref?: React.Ref<HTMLDivElement>
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  className,
  sideOffset = 4,
  ref,
  ...props
}) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-[100] min-w-[200px] overflow-hidden rounded-xl border border-grey-100 bg-white py-1.5 shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
)
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  ref?: React.Ref<HTMLDivElement>
  destructive?: boolean
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  className,
  destructive,
  ref,
  ...props
}) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm outline-none transition-colors',
      destructive
        ? 'text-error-100 focus:bg-error-50'
        : 'text-grey-700 focus:bg-grey-50',
      className,
    )}
    {...props}
  />
)
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> {
  ref?: React.Ref<HTMLDivElement>
}

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
  className,
  ref,
  ...props
}) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('my-1 h-px bg-grey-100', className)}
    {...props}
  />
)
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
}
