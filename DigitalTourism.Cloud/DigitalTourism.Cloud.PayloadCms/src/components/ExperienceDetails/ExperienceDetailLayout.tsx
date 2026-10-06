import React from 'react'
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'

import type { DeepExperience } from '@/lib/payloadData'
import type { ExperienceType } from '@/collections/Experiences/constants'
import { TYPE_TO_SLUG } from '@/collections/Experiences/constants'
import type { PayloadLocale } from '@/i18n/localization'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ExperienceTracker } from '@/components/ExperienceTracker'
import RichText from '@/components/RichText'

import { searchNearbyExperiences } from '@/app/(frontend)/[locale]/search/actions'
import type { MapExplorerPOI } from '@/components/MapExplorer/types'
import { ExperienceHeroV2 } from './ExperienceHeroV2'
import { ExperienceBreadcrumbsBar } from './ExperienceBreadcrumbsBar'
import { ExperienceTabLayout } from './ExperienceTabLayout'
import { ExperienceBrochures } from './ExperienceBrochures'
import { ExperienceGallerySection } from './ExperienceGallerySection'
import { ExperienceVideosSection } from './ExperienceVideosSection'
import { NearbyExperiencesMap } from './NearbyExperiencesMap'
import { RelatedExperiencesCarousel } from './RelatedExperiencesCarousel'
import { InfoTabContent } from './InfoTabContent'
import { ContactsTabContent } from './ContactsTabContent'
import { typeTranslationKeys, buildRelatedDocs, buildBreadcrumbs } from './detailUtils'

export interface ExperienceDetailLayoutProps {
  experience: DeepExperience
  experienceType: ExperienceType
  locale: PayloadLocale
  url: string
  draft?: boolean
  typeSpecificContent?: ReactNode
  pageClient?: ReactNode
  starRating?: number | null
}

export async function ExperienceDetailLayout({
  experience,
  experienceType,
  locale,
  url,
  draft = false,
  typeSpecificContent,
  pageClient,
  starRating,
}: ExperienceDetailLayoutProps) {
  const t = await getTranslations('experiences')
  // Map chrome lives in the mapExplorer namespace; resolved here on the server
  // because the root layout deliberately omits it from client messages.
  const tMap = await getTranslations('mapExplorer')
  const typePath = TYPE_TO_SLUG[experienceType]

  const breadcrumbs = buildBreadcrumbs(experience, experienceType, t)
  const relatedDocs = buildRelatedDocs(experience)

  // Fetch nearby experiences if coordinates are available
  const coords = experience.location?.coordinates
  let nearbyPois: MapExplorerPOI[] = []
  if (coords?.latitude && coords?.longitude) {
    const nearbyResult = await searchNearbyExperiences({
      locale,
      lat: coords.latitude,
      lng: coords.longitude,
      radiusKm: 15,
      perPage: 20,
      excludeId: `${typePath}_${experience.id}`,
    })
    nearbyPois = nearbyResult.hits
      .filter((hit) => hit.location?.coordinates)
      .map((hit) => ({
        id: hit.id,
        title: hit.title,
        slug: hit.slug,
        type: hit.type,
        categories: hit.categories,
        location: {
          lat: hit.location!.coordinates!.latitude,
          lng: hit.location!.coordinates!.longitude,
        },
        city: hit.location?.city,
        heroImageUrl: hit.heroImage?.url,
        heroImageAlt: hit.heroImage?.alt,
      }))
  }

  return (
    <article>
      {pageClient}
      <ExperienceTracker experience={experience} type={experienceType} />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Hero */}
      <ExperienceHeroV2
        heroImage={experience.heroImage}
        title={experience.title}
        type={experienceType}
        typeLabel={t(typeTranslationKeys[experienceType] || experienceType)}
        categories={experience.categories ?? undefined}
        tags={experience.tags ?? undefined}
        cityName={
          experience.city && typeof experience.city === 'object' ? experience.city.name : undefined
        }
        municipalityName={
          experience.city &&
          typeof experience.city === 'object' &&
          experience.city.municipality &&
          typeof experience.city.municipality === 'object'
            ? experience.city.municipality.name
            : undefined
        }
        locationLabel={t('location')}
        starRating={starRating}
      />

      {/* Breadcrumbs + actions */}
      <div className="pt-8 lg:pt-14">
        <ExperienceBreadcrumbsBar
          breadcrumbs={breadcrumbs}
          experienceTitle={experience.title}
          collectionSlug={typePath}
          experienceId={experience.id}
          saveLabel={t('saveToFavorites')}
          savedLabel={t('savedToFavorites')}
        />
      </div>

      {/* Tabs */}
      <ExperienceTabLayout
        className="mt-8 lg:mt-16"
        tabs={[
          {
            id: 'info',
            label: t('information'),
            content: (
              <>
                <InfoTabContent
                  experience={experience}
                  labels={{
                    readingTime: t('readingTime'),
                    minutes: t('minutes'),
                    howToGetThere: t('howToGetThere'),
                    practicalInfo: t('practicalInfo'),
                  }}
                >
                  <h2 className="font-heading text-4xl font-bold leading-[1.15] text-heading mb-8 md:text-[60px]">
                    {t('information')}
                  </h2>
                  {typeSpecificContent}
                  <RichText
                    data={experience.description}
                    enableGutter={false}
                    className="prose-lg"
                  />
                </InfoTabContent>
                {/* Nearby experiences map — only in Info tab */}
                {coords?.latitude && coords?.longitude && nearbyPois.length > 0 && (
                  <NearbyExperiencesMap
                    currentPoi={{
                      id: String(experience.id),
                      title: experience.title,
                      slug: experience.slug || '',
                      type: experienceType,
                      categories: experience.categories?.map((c) => (typeof c === 'object' ? c.title : '')).filter(Boolean),
                      location: { lat: coords.latitude, lng: coords.longitude },
                      city: experience.city && typeof experience.city === 'object' ? experience.city.name : undefined,
                      heroImageUrl: typeof experience.heroImage === 'object' && experience.heroImage?.url ? experience.heroImage.url : undefined,
                      heroImageAlt: typeof experience.heroImage === 'object' && experience.heroImage?.alt ? experience.heroImage.alt : undefined,
                    }}
                    nearbyPois={nearbyPois}
                    viewMapLabel={tMap('viewMap')}
                    closeMapLabel={tMap('closeMap')}
                    viewMoreLabel={tMap('viewMore')}
                    directionsLabel={tMap('getDirections')}
                    heading={t('nearbyExperiences')}
                    description={t('nearbyDescription')}
                  />
                )}
              </>
            ),
          },
          {
            id: 'contacts',
            label: t('workingHoursAndContacts'),
            content: (
              <ContactsTabContent
                experience={experience}
                labels={{
                  workingHours: t('workingHours'),
                  website: t('website'),
                  phone: t('phone'),
                  address: t('address'),
                  getDirections: t('getDirections'),
                  infoCenter: t('infoCenter'),
                  contactInfo: t('contactInfo'),
                  viewMap: tMap('viewMap'),
                  closeMap: tMap('closeMap'),
                }}
              />
            ),
          },
        ]}
      />

      {/* Gallery */}
      {experience.gallery && experience.gallery.length > 0 && (
        <ExperienceGallerySection gallery={experience.gallery} heading={t('gallery')} />
      )}

      {/* Brochures */}
      {experience.brochures && experience.brochures.length > 0 && (
        <section className="container py-16 lg:py-28">
          <h2 className="mb-12 text-center font-heading text-3xl font-bold leading-[1.15] text-heading md:text-5xl lg:text-[60px]">
            {t('brochures')}
          </h2>
          <ExperienceBrochures brochures={experience.brochures} downloadLabel={t('download')} />
        </section>
      )}

      {/* Videos */}
      {experience.videos && experience.videos.length > 0 && (
        <ExperienceVideosSection videos={experience.videos} heading={t('videos')} />
      )}

      {/* Related experiences */}
      {relatedDocs.length > 0 && (
        <RelatedExperiencesCarousel
          docs={relatedDocs}
          heading={t('relatedExperiences')}
          description={t('discoverMore')}
          actionLabel={t('viewMore')}
        />
      )}
    </article>
  )
}
