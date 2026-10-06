'use client'

import * as React from 'react'
import { Link } from '@/i18n/routing'
import { cn } from '@/components/ui/theme/cn'
import { linkIconButtonVariants } from '@/components/ui/primitives/LinkIconButton'

interface MobileMenuIconAction {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  href?: string
  hideOnPhone?: boolean
  node?: undefined
}

interface MobileMenuNodeAction {
  node: React.ReactNode
  hideOnPhone?: boolean
}

export type MobileMenuAction = MobileMenuIconAction | MobileMenuNodeAction

export interface MobileMenuHeaderProps {
  logo: React.ReactNode
  actions: MobileMenuAction[]
  className?: string
}

const MobileMenuHeader: React.FC<MobileMenuHeaderProps> = ({ logo, actions, className }) => {
  return (
    <div className={cn('container flex items-center justify-between py-5', className)}>
      <div className="shrink-0">{logo}</div>
      <div className="flex items-center gap-[9px]">
        {actions.map((action, index) => {
          if ('node' in action && action.node) {
            return (
              <div key={index} className={cn(action.hideOnPhone && 'hidden sm:flex')}>
                {action.node}
              </div>
            )
          }

          const { icon, label, href, onClick, hideOnPhone } = action as MobileMenuIconAction
          const buttonClass = cn(
            linkIconButtonVariants({ variant: 'secondary', size: 'md' }),
            hideOnPhone && 'hidden sm:flex',
          )

          if (href) {
            return (
              <Link key={index} href={href} onClick={onClick} className={buttonClass} aria-label={label}>
                {icon}
              </Link>
            )
          }

          return (
            <button key={index} type="button" onClick={onClick} className={buttonClass} aria-label={label}>
              {icon}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { MobileMenuHeader }
