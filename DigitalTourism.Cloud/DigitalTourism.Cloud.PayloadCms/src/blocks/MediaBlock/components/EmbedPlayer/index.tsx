'use client'

import { toEmbedUrl } from '../../utilities/embedUrl'

interface EmbedPlayerProps {
  url: string
}

export default function EmbedPlayer({ url }: EmbedPlayerProps) {
  const embedSrc = toEmbedUrl(url) ?? url

  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        borderRadius: '0.8rem',
      }}
    >
      <iframe
        src={embedSrc}
        loading="lazy"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
          borderRadius: '0.8rem',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded video"
      />
    </div>
  )
}
