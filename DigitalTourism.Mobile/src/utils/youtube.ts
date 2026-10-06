const YOUTUBE_PATTERNS: RegExp[] = [
  /(?:youtube\.com|youtube-nocookie\.com)\/watch\?(?:[^#]*&)?v=([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com|youtube-nocookie\.com)\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/,
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
];

export function getYouTubeVideoId(url: string): string | null {
  if (!url) {
    return null;
  }
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
