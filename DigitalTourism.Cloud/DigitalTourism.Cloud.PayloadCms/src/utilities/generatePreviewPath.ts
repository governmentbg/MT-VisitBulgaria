import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  path?: string // Optional: full path for nested pages (from breadcrumbs)
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, path, req }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  // For pages, use the provided path (from breadcrumbs) if available
  let pagePath: string
  if (collection === 'pages' && path) {
    // Use the full nested path
    pagePath = path
  } else {
    // Default behavior for other collections
    pagePath = `${collectionPrefixMap[collection]}/${encodedSlug}`
  }

  // Encode path segments to support special characters
  const encodedPath = pagePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  const locale = req?.locale || 'en'

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path: encodedPath,
    locale,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
