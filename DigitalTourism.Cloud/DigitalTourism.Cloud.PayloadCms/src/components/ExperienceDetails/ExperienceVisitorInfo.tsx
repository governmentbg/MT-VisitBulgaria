import React from 'react'
import RichText from '@/components/RichText'
import type { DeepExperience } from '@/lib/payloadData'

interface ExperienceVisitorInfoProps {
  experience: DeepExperience
  labels: {
    workingHours: string
    howToGetThere: string
    practicalInfo: string
    infoCenter: string
    contactInfo: string
  }
}

export const ExperienceVisitorInfo: React.FC<ExperienceVisitorInfoProps> = ({
  experience,
  labels,
}) => {
  const hasContent =
    experience.workingHours?.root?.children?.length ||
    experience.howToGetThere?.root?.children?.length ||
    experience.practicalInfo?.root?.children?.length ||
    experience.infoCenter?.root?.children?.length ||
    experience.contactInfo?.root?.children?.length

  if (!hasContent) return null

  return (
    <div className="space-y-6">
      {experience.workingHours?.root?.children?.length ? (
        <div className="p-5 bg-card rounded-lg border">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
            {labels.workingHours}
          </div>
          <RichText data={experience.workingHours} enableGutter={false} />
        </div>
      ) : null}

      {experience.howToGetThere?.root?.children?.length ? (
        <div className="p-5 bg-card rounded-lg border">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
            {labels.howToGetThere}
          </div>
          <RichText data={experience.howToGetThere} enableGutter={false} />
        </div>
      ) : null}

      {experience.practicalInfo?.root?.children?.length ? (
        <div className="p-5 bg-card rounded-lg border">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
            {labels.practicalInfo}
          </div>
          <RichText data={experience.practicalInfo} enableGutter={false} />
        </div>
      ) : null}

      {experience.infoCenter?.root?.children?.length ? (
        <div className="p-5 bg-card rounded-lg border">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
            {labels.infoCenter}
          </div>
          <RichText data={experience.infoCenter} enableGutter={false} />
        </div>
      ) : null}

      {experience.contactInfo?.root?.children?.length ? (
        <div className="p-5 bg-card rounded-lg border">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
            {labels.contactInfo}
          </div>
          <RichText data={experience.contactInfo} enableGutter={false} />
        </div>
      ) : null}
    </div>
  )
}
