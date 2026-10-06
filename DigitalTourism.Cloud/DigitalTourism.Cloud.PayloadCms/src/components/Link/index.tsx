import { Button, type ButtonProps, cn } from '@/components/ui'
import { Link } from '@/i18n/routing'
import React from 'react'

import type { Page } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  onClick?: () => void
  reference?: {
    relationTo: string
    value: Page | Record<string, unknown> | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    onClick,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href = (() => {
    if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
      const doc = reference.value

      if (reference.relationTo === 'pages') {
        // For pages, use breadcrumbs URL if available
        if ('breadcrumbs' in doc && Array.isArray(doc.breadcrumbs) && doc.breadcrumbs.length > 0) {
          const lastBreadcrumb = doc.breadcrumbs[doc.breadcrumbs.length - 1]
          if (lastBreadcrumb?.url) {
            // Handle home page special case
            return doc.slug === 'home' ? '/' : lastBreadcrumb.url
          }
        }
        // Fallback to slug
        return doc.slug === 'home' ? '/' : `/${doc.slug}`
      }

      return `/${doc.slug}`
    }
    return url
  })()

  if (!href) return null

  // Fall back to the referenced page/post title when no explicit label is provided
  const displayLabel =
    label ||
    (typeof reference?.value === 'object' && 'title' in reference.value
      ? reference.value.title
      : null)

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  // Check if href is an external URL
  const isExternal = href.startsWith('http://') || href.startsWith('https://')

  /* Ensure we don't break any styles set by richText */
  const content = (children || displayLabel) as React.ReactNode

  if (appearance === 'inline') {
    if (isExternal) {
      return (
        <a className={cn(className)} href={href} onClick={onClick} {...newTabProps}>
          {content}
        </a>
      )
    }
    return (
      <Link className={cn(className)} href={href || url || ''} onClick={onClick} {...newTabProps}>
        {content}
      </Link>
    )
  }

  if (isExternal) {
    return (
      <Button asChild className={className} size={size} variant={appearance}>
        <a className={cn(className)} href={href} onClick={onClick} {...newTabProps}>
          {content}
        </a>
      </Button>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href || url || ''} onClick={onClick} {...newTabProps}>
        {content}
      </Link>
    </Button>
  )
}
