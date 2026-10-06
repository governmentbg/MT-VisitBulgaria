import React from 'react'
import { cn } from '@/components/ui/theme/cn'

export interface FeatureHighlightBackgroundProps {
  showDecoration?: boolean
  decorationSrc?: string
  className?: string
}

export const FeatureHighlightBackground: React.FC<FeatureHighlightBackgroundProps> = ({
  showDecoration = false,
  decorationSrc = '/bg.svg',
  className,
}) => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute overflow-hidden',
        'inset-x-0 inset-y-4 sm:inset-y-0',
        'rounded-2xl rounded-bl-[120px]',
        'sm:rounded-[28px] sm:rounded-bl-[200px]',
        'md:rounded-[37px] md:rounded-bl-[374px]',
        'bg-primary-50',
        className,
      )}
      aria-hidden="true"
    >
      {showDecoration && (
        <div
          className="absolute -right-1/4 -top-1/4 h-[150%] w-[150%] bg-contain bg-center bg-no-repeat opacity-[0.15]"
          style={{ backgroundImage: `url('${decorationSrc}')` }}
        />
      )}
    </div>
  )
}
