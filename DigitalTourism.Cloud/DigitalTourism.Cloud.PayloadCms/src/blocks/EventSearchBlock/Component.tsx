// @ts-nocheck — Block removed from editor; component retained for reference
import React from 'react'

import type { EventSearchBlock as EventSearchBlockProps, Page } from '@/payload-types'

import { EventSearchClient } from './Component.client'

function getSearchResultsUrl(searchResultsPage: EventSearchBlockProps['searchResultsPage']): string {
  if (!searchResultsPage) return '/events'
  if (typeof searchResultsPage === 'object') {
    const page = searchResultsPage as Page
    if (page.breadcrumbs?.length) {
      const lastBreadcrumb = page.breadcrumbs[page.breadcrumbs.length - 1]
      if (lastBreadcrumb?.url) return lastBreadcrumb.url
    }
    return page.slug === 'home' ? '/' : `/${page.slug}`
  }
  return '/events'
}

export const EventSearchBlockComponent: React.FC<EventSearchBlockProps> = (props) => {
  const {
    heading,
    whatPlaceholder,
    wherePlaceholder,
    whenPlaceholder,
    searchButtonLabel,
    searchResultsPage,
    backgroundColor = 'teal',
  } = props

  const searchUrl = getSearchResultsUrl(searchResultsPage)

  return (
    <EventSearchClient
      heading={heading}
      whatPlaceholder={whatPlaceholder ?? 'What'}
      wherePlaceholder={wherePlaceholder ?? 'Where'}
      whenPlaceholder={whenPlaceholder ?? 'When'}
      searchButtonLabel={searchButtonLabel ?? 'Search'}
      searchUrl={searchUrl}
      backgroundColor={backgroundColor ?? 'teal'}
    />
  )
}
