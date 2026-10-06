'use client'

import * as React from 'react'
import { Link } from '@/i18n/routing'
import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'

export interface MobileMenuItem {
  label: string
  href?: string
  hasChildren?: boolean
  onClick?: () => void
}

export interface MobileMenuListProps {
  items: MobileMenuItem[]
  className?: string
}

const itemClass = 'flex items-center justify-between w-full text-left'

const MobileMenuList: React.FC<MobileMenuListProps> = ({ items, className }) => {
  return (
    <div className={cn('flex flex-col gap-[30px]', className)}>
      {items.map((item, index) => {
        const content = (
          <>
            <span className="font-sans text-[16px] font-medium leading-[24px] text-black">
              {item.label}
            </span>
            {item.hasChildren && (
              <SpriteIcon name="chevron-right" className="size-5 shrink-0 text-black" />
            )}
          </>
        )

        if (item.href && !item.hasChildren) {
          return (
            <Link key={index} href={item.href} onClick={item.onClick} className={itemClass}>
              {content}
            </Link>
          )
        }

        return (
          <button key={index} type="button" onClick={item.onClick} className={itemClass}>
            {content}
          </button>
        )
      })}
    </div>
  )
}

export { MobileMenuList }
