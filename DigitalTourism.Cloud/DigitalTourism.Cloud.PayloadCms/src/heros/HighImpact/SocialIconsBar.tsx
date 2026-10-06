import React from 'react'
import { cn } from '@/components/ui'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from '@/Footer/icons'
import type { Footer } from '@/payload-types'

type SocialLinkData = NonNullable<Footer['socialLinks']>[number]

interface SocialIconsBarProps {
  links: SocialLinkData[]
  className?: string
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
}

export const SocialIconsBar: React.FC<SocialIconsBarProps> = ({ links, className }) => (
  <div className={cn('gap-4', className)}>
    {links.map(({ platform, url, label }) => {
      const Icon = platform ? iconMap[platform] : null
      if (!Icon) return null
      return (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label || platform || ''}
          className="flex items-center justify-center size-12 rounded-full
                     bg-white/20 border border-white/30 backdrop-blur-sm
                     text-white hover:bg-white/30 transition-colors"
        >
          <Icon className="size-5" />
        </a>
      )
    })}
  </div>
)
