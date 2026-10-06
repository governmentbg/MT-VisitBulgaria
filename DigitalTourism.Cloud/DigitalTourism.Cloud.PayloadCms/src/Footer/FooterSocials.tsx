import { cn } from '@/components/ui'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from './icons'
import React from 'react'

import type { Footer } from '@/payload-types'

type SocialLinkData = NonNullable<Footer['socialLinks']>[number]

interface FooterSocialsProps {
  title: string
  links: SocialLinkData[]
  className?: string
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
}

export const FooterSocials: React.FC<FooterSocialsProps> = ({ title, links, className }) => (
  <div className={cn('flex flex-col gap-4', className)}>
    <h3 className="font-sans font-bold text-lg leading-normal text-white">{title}</h3>
    <nav className="flex flex-col">
      {links.map(({ platform, url, label }) => {
        const Icon = platform ? iconMap[platform] : null
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-2 text-base font-bold text-white hover:text-primary-200 transition-colors"
          >
            {Icon && <Icon className="size-6 shrink-0" />}
            {label}
          </a>
        )
      })}
    </nav>
  </div>
)
