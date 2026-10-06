'use client'

import { cn } from '@/components/ui/theme/cn'
import { AddRegular } from '@/components/ui/icons'

export interface AddButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export const AddButton: React.FC<AddButtonProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-3 rounded-full border border-dashed border-grey-300 px-6 py-4 mb-8',
        'text-xs font-bold text-grey-600 transition-colors',
        'hover:border-primary-400 hover:text-primary-600',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    >
      {label}
      <AddRegular className="h-3 w-3" />
    </button>
  )
}
