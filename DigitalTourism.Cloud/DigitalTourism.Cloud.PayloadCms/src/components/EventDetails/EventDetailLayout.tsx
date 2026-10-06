import React from 'react'
import { getTranslations } from 'next-intl/server'

import type { DeepExperience } from '@/lib/payloadData'
import type { ExperienceType } from '@/collections/Experiences/constants'
import { TYPE_TO_SLUG } from '@/collections/Experiences/constants'
import type { PayloadLocale } from '@/i18n/localization'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ExperienceTracker } from '@/components/ExperienceTracker'

import { EventCountdownHero } from './EventCountdownHero'
import { EventDescriptionSection } from './EventDescriptionSection'
import { EventDetailsPanel } from './EventDetailsPanel'
import { EventOrganizerSection } from './EventOrganizerSection'
import { ExperienceBreadcrumbsBar } from '../ExperienceDetails/ExperienceBreadcrumbsBar'
import { ExperienceTabLayout } from '../ExperienceDetails/ExperienceTabLayout'
import { ExperienceBrochures } from '../ExperienceDetails/ExperienceBrochures'
import { ExperienceGallerySection } from '../ExperienceDetails/ExperienceGallerySection'
import { ExperienceVideosSection } from '../ExperienceDetails/ExperienceVideosSection'
import { RelatedExperiencesCarousel } from '../ExperienceDetails/RelatedExperiencesCarousel'
import { InfoTabContent } from '../ExperienceDetails/InfoTabContent'
import { ContactsTabContent } from '../ExperienceDetails/ContactsTabContent'
import { buildRelatedDocs, buildBreadcrumbs } from '../ExperienceDetails/detailUtils'

export interface EventDetailLayoutProps {
  experience: DeepExperience
  locale: PayloadLocale
  url: string
  draft?: boolean
  pageClient?: React.ReactNode
}

function getLocationName(experience: DeepExperience): string | undefined {
  const city = experience.city as any
  if (!city || typeof city !== 'object') return undefined
  const parts: string[] = []
  if (city.name) parts.push(city.name)
  const region = city.municipality?.region
  if (region && typeof region === 'object' && region.name) parts.push(region.name)
  return parts.length > 0 ? parts.join(', ') : undefined
}

export async function EventDetailLayout({
  experience,
  locale,
  url,
  draft = false,
  pageClient,
}: EventDetailLayoutProps) {
  const t = await getTranslations('experiences')
  // Map chrome lives in the mapExplorer namespace; resolved here on the server
  // because the root layout deliberately omits it from client messages.
  const tMap = await getTranslations('mapExplorer')
  const experienceType: ExperienceType = 'event'
  const typePath = TYPE_TO_SLUG[experienceType]

  const eventData = experience as any
  const startDateParsed = eventData.period?.startDate ? new Date(eventData.period.startDate) : null
  const endDateParsed = eventData.period?.endDate ? new Date(eventData.period.endDate) : null
  const now = new Date()
  const isExpired = endDateParsed ? endDateParsed < now : false
  const isActive = !isExpired && !!startDateParsed && startDateParsed <= now

  const breadcrumbs = buildBreadcrumbs(experience, experienceType, t, { includeCity: true })
  const relatedDocs = buildRelatedDocs(experience)
  const locationName = getLocationName(experience)

  // Build date range string for hero
  const startDateStr = eventData.period?.startDate
  const endDateStr = eventData.period?.endDate
  let dateRange: string | undefined
  if (startDateStr) {
    const fmt = (d: string) =>
      new Date(d).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    const timeFmt = (d: string) =>
      new Date(d).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })

    if (endDateStr) {
      const sameDay =
        new Date(startDateStr).toDateString() === new Date(endDateStr).toDateString()
      if (sameDay) {
        dateRange = `${fmt(startDateStr)}, ${timeFmt(startDateStr)} - ${timeFmt(endDateStr)}`
      } else {
        dateRange = `${fmt(startDateStr)} - ${fmt(endDateStr)}`
      }
    } else {
      dateRange = fmt(startDateStr)
    }
  }

  return (
    <article className='pb-16'>
      {pageClient}
      <ExperienceTracker experience={experience} type={experienceType} />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Hero with countdown */}
      <EventCountdownHero
        heroImage={experience.heroImage}
        title={experience.title}
        subtitle={eventData.subtitle}
        dateRange={dateRange}
        targetDate={eventData.period?.startDate}
        ctaLabel={t('event.goToEvent')}
        ctaHref={eventData.registrationUrl}
        isExpired={isExpired}
        isActive={isActive}
        expiredLabel={t('event.eventEnded')}
        activeLabel={t('event.happeningNow')}
        countdownLabels={{
          days: t('event.days'),
          hours: t('event.hours'),
          minutes: t('event.minutes'),
          seconds: t('event.seconds'),
        }}
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
              <InfoTabContent
                experience={experience}
                labels={{
                  readingTime: t('readingTime'),
                  minutes: t('minutes'),
                  howToGetThere: t('howToGetThere'),
                  practicalInfo: t('practicalInfo'),
                }}
              >
                <EventDescriptionSection
                  heading={t('event.whatToExpect')}
                  categories={experience.categories as any}
                  tags={experience.tags as any}
                  description={experience.description}
                />
              </InfoTabContent>
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

      {/* Organizer section */}
      <EventOrganizerSection
        organizerName={eventData.organizer}
        organizerDescription={eventData.organizerDescription}
        organizerHighlights={eventData.organizerHighlights}
        labels={{ organizer: t('event.organizer') }}
      />

      {/* Event details panel */}
      <EventDetailsPanel
        className="mb-16"
        startDate={eventData.period?.startDate}
        endDate={eventData.period?.endDate}
        allDay={eventData.allDay}
        duration={eventData.duration}
        location={locationName}
        ticketPriceLabel={eventData.ticketPriceLabel}
        ctaHref={eventData.registrationUrl}
        image={experience.heroImage}
        isExpired={isExpired}
        locale={locale}
        labels={{
          heading: t('event.details'),
          ctaLabel: t('event.goToEvent'),
          allDay: t('event.allDay'),
          date: t('event.date'),
          time: t('event.time'),
          duration: t('activity.duration'),
          location: t('event.locationLabel'),
          tickets: t('event.tickets'),
        }}
      />

      {/* Gallery */}
      {experience.gallery && experience.gallery.length > 0 && (
        <ExperienceGallerySection
          gallery={experience.gallery}
          heading={t('gallery')}
          showWatermarks={true}
        />
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

      {/* Related events */}
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
