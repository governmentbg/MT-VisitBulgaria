import React from 'react'
import type { DeepExperience } from '@/lib/payloadData'
import { getVideoMetaBatch } from '@/utilities/videoMetadata'
import { ExperienceVideos } from './ExperienceVideos'

export interface ExperienceVideosSectionProps {
  videos: NonNullable<DeepExperience['videos']>
  heading: string
}

export async function ExperienceVideosSection({ videos, heading }: ExperienceVideosSectionProps) {
  const enrichedVideos = await getVideoMetaBatch(videos.map((v) => v.url)).then((metas) =>
    videos.map((v, i) => ({ ...v, ...metas[i] })),
  )

  return (
    <section className="py-16 lg:py-28">
      <div className="container relative">
        {/* Decorative watermark — anchored to container's bottom-left */}
        <img
          src="/watermark.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-[20%] top-[10%] h-[800px] w-[900px] opacity-50"
        />

        <div className="relative z-10">
          <h2 className="mb-12 text-center font-heading text-3xl font-bold leading-[1.15] text-heading md:text-5xl lg:text-[60px]">
            {heading}
          </h2>
          <ExperienceVideos videos={enrichedVideos} />
        </div>
      </div>
    </section>
  )
}
