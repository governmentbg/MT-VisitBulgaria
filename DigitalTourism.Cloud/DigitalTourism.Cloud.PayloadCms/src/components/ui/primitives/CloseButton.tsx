import { cn } from '@/components/ui/theme/cn'
import { DismissRegular } from '@/components/ui/icons'
import * as React from 'react'

const sizeMap = {
  sm: { button: 'h-8 w-8', icon: 'h-3.5 w-3.5' },
  md: { button: 'h-10 w-10', icon: 'h-4 w-4' },
  lg: { button: 'h-12 w-12', icon: 'h-5 w-5' },
} as const

export interface CloseButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  onClose?: () => void
  size?: 'sm' | 'md' | 'lg'
  ref?: React.Ref<HTMLButtonElement>
}

const CloseButton: React.FC<CloseButtonProps> = ({
  onClose,
  size = 'md',
  className,
  ref,
  onClick,
  ...props
}) => {
  const { button, icon } = sizeMap[size]

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    if (!e.defaultPrevented) {
      onClose?.()
    }
  }

  return (
    <button
      type="button"
      aria-label="Close"
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors',
        'bg-white/80 text-grey-600 hover:bg-grey-100 hover:text-grey-900 active:bg-grey-200',
        button,
        className,
      )}
      ref={ref}
      onClick={handleClick}
      {...props}
    >
      <DismissRegular className={cn(icon, 'stroke-current stroke-[1.5px]')} />
    </button>
  )
}

export { CloseButton }
