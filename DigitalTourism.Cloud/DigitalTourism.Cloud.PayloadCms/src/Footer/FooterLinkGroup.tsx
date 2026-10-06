import { CMSLink } from '@/components/Link'
import { cn } from '@/components/ui'
import React from 'react'

import type { Footer } from '@/payload-types'

type LinkGroupData = NonNullable<Footer['linkGroups']>[number]

interface FooterLinkGroupProps {
  title: string
  links: NonNullable<LinkGroupData['links']>
  className?: string
}

export const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links, className }) => (
  <div className={cn('flex flex-col gap-4', className)}>
    <h3 className="font-sans font-bold text-lg leading-normal text-white">{title}</h3>
    <nav className="flex flex-col">
      {links.map(({ link }, i) => (
        <CMSLink
          key={i}
          className="py-2 text-base font-bold text-white hover:text-primary-200 transition-colors"
          {...link}
        />
      ))}
    </nav>
  </div>
)
