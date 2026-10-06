import type React from 'react'
import type { Page } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id)()) as Page

      if (collection === 'pages') {
        // Use breadcrumbs URL for pages
        const page = document as Page
        if (page?.breadcrumbs && Array.isArray(page.breadcrumbs) && page.breadcrumbs.length > 0) {
          const lastBreadcrumb = page.breadcrumbs[page.breadcrumbs.length - 1]
          redirectUrl = page.slug === 'home' ? '/' : (lastBreadcrumb?.url || `/${page.slug}`)
        } else {
          redirectUrl = page?.slug === 'home' ? '/' : `/${page?.slug}`
        }
      } else {
        redirectUrl = `/${collection}/${document?.slug}`
      }
    } else {
      const doc = redirectItem.to?.reference?.value as Page | undefined
      const collection = redirectItem.to?.reference?.relationTo

      if (collection === 'pages' && doc) {
        const page = doc as Page
        if (page?.breadcrumbs && Array.isArray(page.breadcrumbs) && page.breadcrumbs.length > 0) {
          const lastBreadcrumb = page.breadcrumbs[page.breadcrumbs.length - 1]
          redirectUrl = page.slug === 'home' ? '/' : (lastBreadcrumb?.url || `/${page.slug}`)
        } else {
          redirectUrl = page?.slug === 'home' ? '/' : `/${page?.slug}`
        }
      } else {
        redirectUrl = `${collection !== 'pages' ? `/${collection}` : ''}/${doc?.slug || ''}`
      }
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
