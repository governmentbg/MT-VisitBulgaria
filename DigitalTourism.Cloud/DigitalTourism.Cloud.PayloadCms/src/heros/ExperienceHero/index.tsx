import React from 'react'
import { getTranslations } from 'next-intl/server'

import type { DeepExperience, } from '@/lib/payloadData'
import { Media } from '@/components/Media'

const typeLabels: Record<string, string> = {
  hotel: 'hotels',
  restaurant: 'restaurants',
  activity: 'activities',
  attraction: 'attractions',
  event: 'events',
}

export const ExperienceHero: React.FC<{
  experience: DeepExperience
  type?: string
}> = async ({ experience, type: typeProp }) => {
  const { heroImage, title, categories } = experience
  const type = typeProp
  const t = await getTranslations('experiences')

  
  const cityName = experience.city?.name
  const municipalityName = experience.city?.municipality?.name

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {type && (
              <span className="uppercase text-sm bg-white/20 px-2 py-1 rounded">
                {t(typeLabels[type] as Parameters<typeof t>[0])}
              </span>
            )}
            {categories && categories.length > 0 && (
              <div className="uppercase text-sm">
                {categories.map((category, index) => {
                  if (typeof category === 'object' && category !== null) {
                    const { title: categoryTitle } = category
                    const isLast = index === categories.length - 1
                    return (
                      <React.Fragment key={index}>
                        {categoryTitle || 'Untitled category'}
                        {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                      </React.Fragment>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {cityName && (
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-80">{t('location')}</p>
                <p>
                  {cityName}
                  {municipalityName && `, ${municipalityName}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[75vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority usePayloadSizes imgClassName="-z-10 object-cover" resource={heroImage} preferredSize="og" size="100vw" mobileMaxSize="medium" />
        )}
        <div className="hero-overlay absolute inset-0 pointer-events-none" />
      </div>
    </div>
  )
}
