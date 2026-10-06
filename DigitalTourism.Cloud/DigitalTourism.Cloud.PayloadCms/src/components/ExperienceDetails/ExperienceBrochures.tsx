import React from 'react'
import type { AnyExperience } from '@/collections/Experiences/types'
import { ObjectCardSimple } from '@/components/ui/composites/ObjectCardSimple'

type BrochureItem = NonNullable<AnyExperience['brochures']>[number]

interface ExperienceBrochuresProps {
  brochures: BrochureItem[]
  downloadLabel: string
}

function DocumentIcon() {
  return (
    <svg className="size-12 text-grey-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  )
}

export const ExperienceBrochures: React.FC<ExperienceBrochuresProps> = ({
  brochures,
  downloadLabel,
}) => {
  if (!brochures || brochures.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {brochures.map((brochure, index) => {
        const file = typeof brochure.file === 'object' ? brochure.file : null
        if (!file?.url) return null

        return (
          <ObjectCardSimple
            key={brochure.id || index}
            icon={<DocumentIcon />}
            title={brochure.title || file.filename || `Brochure ${index + 1}`}
            href={file.url}
            actionLabel={downloadLabel}
            actionIcon={<DownloadIcon />}
          />
        )
      })}
    </div>
  )
}
