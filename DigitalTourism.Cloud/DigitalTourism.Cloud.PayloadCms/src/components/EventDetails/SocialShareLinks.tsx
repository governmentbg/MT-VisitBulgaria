'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/components/ui'
import { FacebookIcon, XIcon, InstagramIcon } from '@/Footer/icons'

export interface SocialShareLinksProps {
  title?: string
  url?: string
  className?: string
}

export const SocialShareLinks: React.FC<SocialShareLinksProps> = ({
  title = '',
  url: externalUrl,
  className,
}) => {
  const [shareUrl, setShareUrl] = useState(externalUrl || '')

  useEffect(() => {
    if (!externalUrl) {
      setShareUrl(window.location.href)
    }
  }, [externalUrl])

  const links = [
    {
      key: 'facebook',
      Icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      label: 'Facebook',
    },
    {
      key: 'x',
      Icon: XIcon,
      href: `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      label: 'X',
    },
    {
      key: 'instagram',
      Icon: InstagramIcon,
      href: '#',
      label: 'Instagram',
    },
  ]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {links.map(({ key, Icon, href, label }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-grey-200 bg-grey-100 text-grey-600 transition-colors hover:bg-grey-200 hover:text-grey-800"
        >
          <Icon className="h-6 w-6" />
        </a>
      ))}
    </div>
  )
}
