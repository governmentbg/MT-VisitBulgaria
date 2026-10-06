export interface ParsedVideo {
  provider: 'youtube' | 'vimeo' | null
  videoId: string | null
}

/**
 * Extracts the video provider and ID from a YouTube/Vimeo URL.
 */
export function parseVideoUrl(url: string): ParsedVideo {
  try {
    const parsed = new URL(url)

    if (
      parsed.hostname === 'www.youtube.com' ||
      parsed.hostname === 'youtube.com' ||
      parsed.hostname === 'm.youtube.com'
    ) {
      const videoId = parsed.searchParams.get('v')
      if (videoId) return { provider: 'youtube', videoId }
    }

    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1)
      if (videoId) return { provider: 'youtube', videoId }
    }

    if (parsed.hostname === 'www.vimeo.com' || parsed.hostname === 'vimeo.com') {
      const match = parsed.pathname.match(/^\/(\d+)/)
      if (match) return { provider: 'vimeo', videoId: match[1] }
    }

    return { provider: null, videoId: null }
  } catch {
    return { provider: null, videoId: null }
  }
}

/**
 * Converts YouTube/Vimeo URLs to their embed equivalents.
 * Returns null if the URL is not recognized.
 */
export function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)

    // YouTube: youtube.com/watch?v=ID or youtu.be/ID
    if (
      parsed.hostname === 'www.youtube.com' ||
      parsed.hostname === 'youtube.com' ||
      parsed.hostname === 'm.youtube.com'
    ) {
      const videoId = parsed.searchParams.get('v')
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }

    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1)
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }

    // Vimeo: vimeo.com/ID
    if (parsed.hostname === 'www.vimeo.com' || parsed.hostname === 'vimeo.com') {
      const match = parsed.pathname.match(/^\/(\d+)/)
      if (match) return `https://player.vimeo.com/video/${match[1]}`
    }

    return null
  } catch {
    return null
  }
}
