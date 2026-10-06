'use client'

import * as React from 'react'
import { Link } from '@/i18n/routing'
import { cn } from '@/components/ui/theme/cn'

export interface MobileMenuActionButton {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  href?: string
  fullWidth?: boolean
}

export interface MobileMenuActionsProps {
  actions: MobileMenuActionButton[]
  className?: string
}

const MobileMenuActions: React.FC<MobileMenuActionsProps> = ({ actions, className }) => {
  return (
    <div className={cn('grid grid-cols-2 gap-4 px-4 sm:px-6 md:px-8', className)}>
      {actions.map((action, index) => {
        const pillClass = cn(
          'flex items-center justify-center gap-[6px] w-full rounded-full bg-primary-700 px-8 py-4 font-sans text-[14px] font-bold leading-[1.4] text-white transition-colors hover:bg-primary-800',
          action.fullWidth && 'col-span-2',
        )

        const content = (
          <>
            {action.icon && (
              <span className="flex items-center justify-center size-6 [&_svg]:size-5">
                {action.icon}
              </span>
            )}
            <span>{action.label}</span>
          </>
        )

        if (action.href) {
          return (
            <Link key={index} href={action.href} onClick={action.onClick} className={pillClass}>
              {content}
            </Link>
          )
        }

        return (
          <button key={index} type="button" onClick={action.onClick} className={pillClass}>
            {content}
          </button>
        )
      })}
    </div>
  )
}

export { MobileMenuActions }
