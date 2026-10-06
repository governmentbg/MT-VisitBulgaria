import type { Metadata } from 'next'

import type { Media, Page, Config } from '../payload-types'
import type { AnyExperience } from '@/collections/Experiences/types'
import type { PayloadLocale } from '@/i18n/localization'
import type { MetaDoc } from '@/lib/payloadData/types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { EXPERIENCE_SLUGS, SLUG_TO_PATH, type ExperienceSlug } from '@/collections/Experiences/constants'
import { getSiteIdentity } from './getSettings'

const experienceSlugSet = new Set<string>(EXPERIENCE_SLUGS)

// Build hreflang alternates from alternate URLs map
const buildAlternates = (alternateUrls?: Record<string, string>): Metadata['alternates'] => {
  if (!alternateUrls || Object.keys(alternateUrls).length === 0) return undefined
  const serverUrl = getServerSideURL()
  const languages: Record<string, string> = {}
  for (const [loc, path] of Object.entries(alternateUrls)) {
    languages[loc] = `${serverUrl}/${loc}${path}`
  }
  return { languages }
}

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

// Extract plain text from Lexical rich text for meta description
const extractTextFromRichText = (richText: AnyExperience['description'] | null | undefined): string => {
  if (!richText?.root?.children) return ''

  const extractText = (children: unknown[]): string => {
    return children
      .map((child) => {
        if (typeof child === 'object' && child !== null) {
          const node = child as { type?: string; text?: string; children?: unknown[] }
          if (node.type === 'text' && typeof node.text === 'string') {
            return node.text
          }
          if (node.children && Array.isArray(node.children)) {
            return extractText(node.children)
          }
        }
        return ''
      })
      .join(' ')
  }

  const text = extractText(richText.root.children)
  // Truncate to ~160 characters for meta description
  return text.length > 160 ? text.substring(0, 157) + '...' : text
}

export const formatPageTitle = (pageTitle: string, siteName: string): string =>
  `${pageTitle} | ${siteName}`

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<AnyExperience> | MetaDoc | null
  collectionSlug?: string
  locale: PayloadLocale
  alternateUrls?: Record<string, string>
}): Promise<Metadata> => {
  const { doc, collectionSlug, locale, alternateUrls } = args
  const { siteName, siteTagline, defaultMetaDescription } = await getSiteIdentity(locale)
  const ogDefaults = { siteName, title: siteTagline || siteName, description: defaultMetaDescription }

  // Handle Experience documents — identified by collectionSlug being one of the experience collections
  if (collectionSlug && experienceSlugSet.has(collectionSlug) && doc) {
    const expDoc = doc as Partial<AnyExperience>
    const ogImage = getImageURL(expDoc.heroImage as Media | undefined)
    const description = extractTextFromRichText(expDoc.description)
    const pathSegment = SLUG_TO_PATH[collectionSlug as ExperienceSlug]

    const title = expDoc.title
      ? formatPageTitle(expDoc.title, siteName)
      : siteName

    return {
      description,
      openGraph: mergeOpenGraph({
        description,
        images: ogImage
          ? [
              {
                url: ogImage,
              },
            ]
          : undefined,
        title,
        url: `/${locale}/${pathSegment}/${expDoc.slug}`,
      }, ogDefaults),
      title,
      alternates: buildAlternates(alternateUrls),
    }
  }

  // Handle Page and Post documents with meta field
  // Fall back to heroImage if no meta image, and title if no meta title
  const pageOrPost = doc as Partial<Page> | null
  const metaImage = pageOrPost?.meta?.image
  const heroImage = (pageOrPost as any)?.heroImage
  const ogImage = getImageURL(metaImage || (heroImage as Media | undefined))

  const docTitle = pageOrPost?.title
  const title = pageOrPost?.meta?.title
    ? formatPageTitle(pageOrPost.meta.title, siteName)
    : docTitle
      ? formatPageTitle(docTitle, siteName)
      : siteName

  const slugPath = Array.isArray(pageOrPost?.slug) ? '/' + pageOrPost.slug.join('/') : '/'

  return {
    description: pageOrPost?.meta?.description,
    openGraph: mergeOpenGraph({
      description: pageOrPost?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: `/${locale}${slugPath}`,
    }, ogDefaults),
    title,
    alternates: buildAlternates(alternateUrls),
  }
}
