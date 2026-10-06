import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { getPayloadClient } from '@/payload/payloadClient'
import type { RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'
import { setRequestLocale } from 'next-intl/server'
import localization, { isValidLocale, type PayloadLocale } from '@/i18n/localization'
import { notFound } from 'next/navigation'

import { PageContent } from '@/components/PageContent'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { getHomePageId } from '@/utilities/getSettings'
import { getPageMetaDoc } from '@/lib/payloadData/server'
import type { NavTheme } from '@/Header/types'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { AlternateUrlsClient } from '@/components/AlternateUrlsClient'
import { getAlternateUrls } from '@/utilities/getAlternateUrls'

export async function generateStaticParams() {
  return []
}

export const revalidate = 600

type Args = {
  params: Promise<{
    locale: PayloadLocale
    slug?: string[] // Changed from string to string[] for catch-all
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale, slug: slugSegments } = await paramsPromise

  // Guard against non-locale paths (e.g. /lib/..., /_next/...) hitting this catch-all route
  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  // Build the full path from segments
  // Empty or undefined means home page
  const isHome = !slugSegments || slugSegments.length === 0
  const fullPath = isHome ? '/' : '/' + slugSegments.map((s) => decodeURIComponent(s)).join('/')

  let page: RequiredDataFromCollectionSlug<'pages'> | null = null

  page = (await queryPageByPath({
    path: fullPath,
    locale,
  })) as RequiredDataFromCollectionSlug<'pages'> | null

  // Remove this code once your website is seeded
  if (!page && isHome) {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={fullPath} />
  }

  const alternateUrls = page.id
    ? await getAlternateUrls({ collection: 'pages', id: page.id })
    : {}

  const { hero, content, breadcrumbs } = page

  const isFullBleedHero = ['highImpact', 'mediumImpact'].includes(hero?.type ?? '')
  const navTheme: NavTheme = isFullBleedHero
    ? (((hero as Record<string, unknown>).navTheme as NavTheme) ?? 'transparent-light')
    : 'solid'

  // If locale breadcrumbs are broken (missing labels/URLs from untranslated slugs),
  // fall back to English breadcrumbs which are always complete.
  const hasBrokenBreadcrumbs = breadcrumbs?.some((crumb) => !crumb.label || !crumb.url)
  let validBreadcrumbs = breadcrumbs?.filter((crumb) => crumb.label) ?? []
  if (hasBrokenBreadcrumbs && page.id && locale !== localization.defaultLocale) {
    try {
      const payload = await getPayloadClient()
      const enPage = await payload.findByID({
        collection: 'pages',
        id: page.id,
        locale: localization.defaultLocale,
        depth: 0,
        select: { breadcrumbs: true },
      })
      if (enPage?.breadcrumbs) {
        validBreadcrumbs = enPage.breadcrumbs.filter((crumb) => crumb.label)
      }
    } catch {
      // Page may have been deleted between queries
    }
  }

  // Show breadcrumbs below the hero for non-home pages (same position as ExperienceBreadcrumbsBar)
  const showBreadcrumbs = !isHome && validBreadcrumbs.length > 1

  return (
    <article
      className={isFullBleedHero ? ' ' : 'pt-16 '}
      data-header-theme={navTheme !== 'solid' ? navTheme : undefined}
    >
      <PageClient navTheme={navTheme} />
      <AlternateUrlsClient urls={alternateUrls} />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={fullPath} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} breadcrumbs={validBreadcrumbs} />

      {showBreadcrumbs && (
        <nav aria-label="Breadcrumb" className="container py-4">
          <ol className="flex flex-wrap items-center gap-2 font-heading text-sm leading-[1.2] text-grey-900 sm:text-base lg:text-xl">
            {validBreadcrumbs.map((crumb, index) => {
              const isLast = index === validBreadcrumbs.length - 1
              return (
                <li key={crumb.id || index} className="flex items-center gap-2">
                  {crumb.url && !isLast ? (
                    <a
                      href={crumb.url}
                      className="font-semibold transition-colors hover:text-primary-700"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className={`font-semibold ${isLast ? 'truncate font-extrabold' : ''}`}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <svg className="h-5 w-5 flex-shrink-0 text-grey-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      )}

      {content && (
        <div className="py-8 lg:py-12">
          <PageContent data={content} pageId={page.id as number} />
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale, slug: slugSegments } = await paramsPromise

  // Guard against non-locale paths hitting this catch-all route
  if (!isValidLocale(locale)) {
    return {}
  }

  const isHome = !slugSegments || slugSegments.length === 0
  const fullPath = isHome ? '/' : '/' + slugSegments.map((s) => decodeURIComponent(s)).join('/')

  const doc = await getPageMetaDoc({ path: fullPath, locale })

  const alternateUrls = doc?.id
    ? await getAlternateUrls({ collection: 'pages', id: doc.id as number })
    : undefined

  return generateMeta({ doc, locale, alternateUrls })
}

// Query page by its full URL path (from breadcrumbs)
// The nested-docs plugin stores the full path in the last breadcrumb's url field
const queryPageByPath = cache(async ({ path, locale }: { path: string; locale: PayloadLocale }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadClient()
  const defaultLocale = localization.defaultLocale

  // For home page, use the configured home page from settings, or fall back to slug === 'home'
  if (path === '/') {
    const homePageId = await getHomePageId()

    const pageSelect = {
      hero: true,
      content: true,
      breadcrumbs: true,
      slug: true,
      parent: true,
    } as const

    if (homePageId) {
      try {
        const page = await payload.findByID({
          collection: 'pages',
          id: homePageId,
          draft,
          locale,
          fallbackLocale: defaultLocale,
          overrideAccess: draft,
          depth: 1,
          select: pageSelect,
        })
        if (page) return page
      } catch {
        // Home page ID from settings no longer exists in DB
      }
    }

    // Fallback: query by slug === 'home' when no settings configured
    const result = await payload.find({
      collection: 'pages',
      draft,
      locale,
      fallbackLocale: defaultLocale,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      depth: 1,
      select: pageSelect,
      where: {
        slug: { equals: 'home' },
      },
    })
    return result.docs?.[0] || null
  }

  // Extract the last segment as slug for the query
  const slug = path.split('/').filter(Boolean).pop()
  if (!slug) return null

  // Query by slug - this is more reliable than breadcrumbs.url query
  // because breadcrumbs.url matches ANY breadcrumb in the array, not just the last one
  const result = await payload.find({
    collection: 'pages',
    draft,
    locale,
    fallbackLocale: defaultLocale,
    limit: 10, // Get multiple results to find the right one
    pagination: false,
    overrideAccess: draft,
    depth: 1,
    select: {
      hero: true,
      content: true,
      breadcrumbs: true,
      slug: true,
      parent: true,
    },
    where: {
      slug: { equals: slug },
    },
  })

  const pageSelect = {
    hero: true,
    content: true,
    breadcrumbs: true,
    slug: true,
    parent: true,
  } as const

  // Find the page whose LAST breadcrumb URL matches the requested path
  for (const page of result.docs || []) {
    const lastBreadcrumb = page.breadcrumbs?.[page.breadcrumbs.length - 1]
    if (lastBreadcrumb?.url === path) {
      return page
    }
    // Also match root-level pages (parent is home or null) where path is just /slug
    if (!page.parent && path === `/${slug}`) {
      return page
    }
  }

  // Fallback: the URL may contain a slug from a different locale (e.g. English slug
  // used in a French URL). Query with the default locale to find the page, then
  // re-fetch it with the requested locale to get localized content.
  if (locale !== defaultLocale) {
    const fallbackResult = await payload.find({
      collection: 'pages',
      draft,
      locale: defaultLocale,
      limit: 10,
      pagination: false,
      overrideAccess: draft,
      depth: 0,
      select: { slug: true, breadcrumbs: true, parent: true },
      where: { slug: { equals: slug } },
    })

    for (const fallbackPage of fallbackResult.docs || []) {
      const lastBreadcrumb = fallbackPage.breadcrumbs?.[fallbackPage.breadcrumbs.length - 1]
      const isMatch = lastBreadcrumb?.url === path || (!fallbackPage.parent && path === `/${slug}`)
      if (isMatch) {
        // Found the page by its English slug — re-fetch with the requested locale
        try {
          return await payload.findByID({
            collection: 'pages',
            id: fallbackPage.id,
            draft,
            locale,
            fallbackLocale: defaultLocale,
            overrideAccess: draft,
            depth: 1,
            select: pageSelect,
          })
        } catch {
          return null
        }
      }
    }
  }

  return null
})
