import React from 'react'
import type { ReactNode } from 'react'
import type { DeepExperience } from '@/lib/payloadData'
import { ReadingTimeIndicator } from './ReadingTimeIndicator'
import { RichTextSection } from './RichTextSection'

export interface InfoTabContentProps {
  experience: DeepExperience
  labels: {
    readingTime: string
    minutes: string
    howToGetThere: string
    practicalInfo: string
  }
  children?: ReactNode
}

export async function InfoTabContent({ experience, labels, children }: InfoTabContentProps) {
  return (
    <div className="container pt-16 pb-8">
      <div className="mx-auto max-w-[1066px]">
        <ReadingTimeIndicator
          richTextData={experience.description}
          label={labels.readingTime}
          minutesLabel={labels.minutes}
          className="mb-4"
        />

        {children}

        <RichTextSection
          data={experience.howToGetThere}
          heading={labels.howToGetThere}
          variant="info"
        />

        <RichTextSection
          data={experience.practicalInfo}
          heading={labels.practicalInfo}
          variant="info"
        />
      </div>
    </div>
  )
}
