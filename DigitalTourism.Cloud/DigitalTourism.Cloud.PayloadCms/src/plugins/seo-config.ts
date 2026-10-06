import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import type { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { EXPERIENCE_SLUGS, SLUG_TO_PATH, type ExperienceSlug } from '@/collections/Experiences/constants'

const experienceSlugSet = new Set<string>(EXPERIENCE_SLUGS)

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Visit Bulgaria` : 'Visit Bulgaria'
}

const generateURL: GenerateURL<Page> = ({ doc, collectionSlug }) => {
  const url = getServerSideURL()

  if (!doc?.slug) return url

  // Handle experience collections — derive path from collection slug
  if (collectionSlug && experienceSlugSet.has(collectionSlug)) {
    const typePath = SLUG_TO_PATH[collectionSlug as ExperienceSlug]
    return `${url}/${typePath}/${doc.slug}`
  }

  // Handle pages with nested paths (breadcrumbs)
  if ('breadcrumbs' in doc && Array.isArray(doc.breadcrumbs) && doc.breadcrumbs.length > 0) {
    const lastBreadcrumb = doc.breadcrumbs[doc.breadcrumbs.length - 1] as { url?: string }
    if (lastBreadcrumb?.url) {
      // Handle home page
      if (doc.slug === 'home') {
        return url
      }
      return `${url}${lastBreadcrumb.url}`
    }
  }

  // Fallback for simple pages
  if (doc.slug === 'home') return url
  return `${url}/${doc.slug}`
}

export const seo = seoPlugin({
  generateTitle,
  generateURL,
})
