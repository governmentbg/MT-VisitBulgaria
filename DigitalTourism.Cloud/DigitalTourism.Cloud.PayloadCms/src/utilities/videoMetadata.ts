import { unstable_cache } from 'next/cache'
import { parseVideoUrl, toEmbedUrl } from '@/blocks/MediaBlock/utilities/embedUrl'

export interface VideoMeta {
  thumbnailUrl: string | null
  embedUrl: string | null
  provider: 'youtube' | 'vimeo' | null
  videoId: string | null
}

const EMPTY_META: VideoMeta = {
  thumbnailUrl: null,
  embedUrl: null,
  provider: null,
  videoId: null,
}

async function fetchVimeoThumbnail(videoId: string, url: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
      { next: { revalidate: 86_400 } },
    )
    if (!res.ok) return null
    const data = await res.json()
    return (data.thumbnail_url as string) ?? null
  } catch {
    return null
  }
}

const getCachedVimeoThumbnail = (videoId: string, url: string) =>
  unstable_cache(() => fetchVimeoThumbnail(videoId, url), ['vimeo-oembed', videoId], {
    tags: [`video-oembed_${videoId}`],
    revalidate: 86_400,
  })

export async function getVideoMeta(url: string): Promise<VideoMeta> {
  const { provider, videoId } = parseVideoUrl(url)
  const embedUrl = toEmbedUrl(url)

  if (!provider || !videoId) {
    return { ...EMPTY_META, embedUrl }
  }

  if (provider === 'youtube') {
    return {
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      embedUrl,
      provider,
      videoId,
    }
  }

  // Vimeo — fetch oEmbed for thumbnail (cached)
  const thumbnailUrl = await getCachedVimeoThumbnail(videoId, url)()
  return { thumbnailUrl, embedUrl, provider, videoId }
}

export async function getVideoMetaBatch(
  urls: string[],
): Promise<VideoMeta[]> {
  const results = await Promise.allSettled(urls.map(getVideoMeta))
  return results.map((r) => (r.status === 'fulfilled' ? r.value : EMPTY_META))
}
