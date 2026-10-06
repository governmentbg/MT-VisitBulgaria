'use client'

import React from 'react'
import { CMSLink } from '@/components/Link'

import type { MainMenu } from '@/payload-types'

type Tab = NonNullable<MainMenu['tabs']>[number]

export interface InfoOverlayProps {
  tab: Tab
  onClose: () => void
  iconMap?: Record<string, React.ComponentType<{ className?: string }>>
}

function getIconForLabel(
  label: string | null | undefined,
  icons?: Record<string, React.ComponentType<{ className?: string }>>,
): React.ComponentType<{ className?: string }> | null {
  if (!label || !icons) return null
  if (icons[label]) return icons[label]
  for (const [key, icon] of Object.entries(icons)) {
    if (label.includes(key) || key.includes(label)) return icon
  }
  return null
}

export const InfoOverlay: React.FC<InfoOverlayProps> = ({ tab, onClose, iconMap }) => {
  // Each navItem with listLinks becomes a column with a header (tag) and items (links)
  const columns = (tab.navItems ?? [])
    .filter((item) => item.listLinks?.links && item.listLinks.links.length > 0)
    .map((item) => ({
      header: item.listLinks?.tag ?? '',
      links: (item.listLinks?.links ?? []).map((linkItem) => ({
        link: linkItem.link,
        label: linkItem.link?.label ?? '',
      })),
    }))

  return (
    <div className="flex gap-8 rounded-2xl bg-white px-16 py-6 min-h-[296px] max-w-[1077px]">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-1 flex-col gap-4">
          {/* Column header */}
          {column.header && (
            <span className="font-sans text-[16px] font-bold text-grey-600">{column.header}</span>
          )}

          {/* Menu items */}
          <div className="flex flex-col gap-4">
            {column.links.map((item, itemIndex) => {
              const Icon = getIconForLabel(item.label, iconMap)

              return (
                <div key={itemIndex} className="flex w-[288px] items-start gap-3 py-2">
                  {Icon && (
                    <span className="shrink-0 text-grey-600">
                      <Icon className="size-6" />
                    </span>
                  )}
                  <CMSLink
                    {...item.link}
                    appearance="inline"
                    className="relative font-sans text-[16px] text-button-primary no-underline pb-1 after:block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 after:ease-out after:w-0 hover:after:w-full hover:font-bold"
                    onClick={onClose}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
