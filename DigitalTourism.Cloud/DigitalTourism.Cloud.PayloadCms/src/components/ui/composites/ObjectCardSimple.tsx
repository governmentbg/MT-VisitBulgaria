import { cn } from '@/components/ui/theme/cn'
import { buttonVariants } from '../primitives/Button'
import * as React from 'react'

export interface ObjectCardSimpleProps {
  icon?: React.ReactNode
  title: string
  description?: string
  href: string
  actionLabel?: string
  actionIcon?: React.ReactNode
  className?: string
}

const cardClasses =
  'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-grey-50 bg-white font-sans shadow-lg no-underline'

const ObjectCardSimple: React.FC<ObjectCardSimpleProps> = ({
  icon,
  title,
  description,
  href,
  actionLabel,
  actionIcon,
  className,
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(cardClasses, className)}
    >
      <div className="flex flex-1 flex-col justify-center gap-6 px-7 py-5 mob-ls:gap-3 mob-ls:px-4 mob-ls:py-3">
        <div className="flex flex-col gap-4 mob-ls:gap-2">
          <div className="flex items-center gap-3">
            {icon && <span className="shrink-0">{icon}</span>}
            <h3 className="font-heading text-xl font-bold leading-[1.4] tracking-[-0.03rem] text-button-primary line-clamp-3">
              {title}
            </h3>
          </div>
          {description && (
            <p className="text-sm font-medium leading-[1.4] text-button-primary line-clamp-4">
              {description}
            </p>
          )}
        </div>
        {actionLabel && (
          <span className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'w-full hover:bg-inherit hover:text-inherit group-hover:bg-primary-50 group-hover:text-primary-900')}>
            {actionLabel}
            {actionIcon && <span className="inline-flex shrink-0">{actionIcon}</span>}
          </span>
        )}
      </div>
    </a>
  )
}

export { ObjectCardSimple }
