/**
 * Processes media resource URL to ensure proper formatting.
 * Uses relative URLs for same-origin media to avoid SSR/client hydration mismatches.
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  // Absolute URLs are returned as-is (external media)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // Relative URLs stay relative — the browser resolves them against the page origin,
  // which is identical on both server and client, preventing hydration mismatches
  // and duplicate image fetches.
  return cacheTag ? `${url}?${cacheTag}` : url
}
