'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/components/ui'
import { GlobeRegular, CallRegular } from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import RichText from '@/components/RichText'
import { EmbeddedMap } from '@/components/MapExplorer/EmbeddedMap/EmbeddedMap'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

const LocationMapClient = dynamic(
  () =>
    import('./LocationMapClient').then((m) => ({
      default: m.LocationMapClient,
    })),
  { ssr: false },
)

export interface WorkingHoursAndContactsProps {
  workingHours?: DefaultTypedEditorState | null
  contact?: {
    phone?: string | null
    email?: string | null
    website?: string | null
  } | null
  location?: {
    address?: string | null
    coordinates?: {
      latitude?: number | null
      longitude?: number | null
    } | null
  } | null
  labels?: {
    workingHours?: string
    website?: string
    phone?: string
    address?: string
    getDirections?: string
    viewMap?: string
    closeMap?: string
  }
  hideMap?: boolean
  className?: string
}

interface ContactCardProps {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}

const ContactCard: React.FC<ContactCardProps> = ({ icon, label, value, href }) => (
  <div className="flex gap-4 items-start">
    <div className="flex-shrink-0 text-heading">{icon}</div>
    <div className="flex flex-col gap-1">
      <p className="font-heading text-xl font-bold leading-[1.3] text-heading">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-medium leading-[1.6] underline decoration-solid hover:text-primary transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="text-lg font-medium leading-[1.6]">{value}</p>
      )}
    </div>
  </div>
)

export interface LocationMapProps {
  coordinates: { latitude: number; longitude: number }
  directionsLabel?: string
  viewMapLabel?: string
  closeMapLabel?: string
  className?: string
}

export const LocationMap: React.FC<LocationMapProps> = ({
  coordinates,
  directionsLabel,
  viewMapLabel,
  closeMapLabel,
  className,
}) => {
  return (
    <div className={cn('container', className)}>
      <div className="mx-auto max-w-[1340px]">
        <EmbeddedMap
          className="overflow-hidden rounded-2xl h-[240px] md:h-[720px] animate-pulse bg-grey-100 [&:has(.leaflet-container)]:animate-none [&:has(.leaflet-container)]:bg-transparent"
          viewLabel={viewMapLabel ?? ''}
          closeLabel={closeMapLabel ?? ''}
        >
          {({ interactive }) => (
            <LocationMapClient
              center={[coordinates.latitude, coordinates.longitude]}
              zoom={15}
              directionsLabel={directionsLabel}
              interactive={interactive}
            />
          )}
        </EmbeddedMap>
      </div>
    </div>
  )
}

export const WorkingHoursAndContacts: React.FC<WorkingHoursAndContactsProps> = ({
  workingHours,
  contact,
  location,
  labels = {},
  hideMap = false,
  className,
}) => {
  const {
    workingHours: workingHoursLabel = 'Работно време',
    website: websiteLabel = 'Уебсайт',
    phone: phoneLabel = 'Телефон',
    address: addressLabel = 'Адрес',
  } = labels

  const hasWorkingHours = !!(workingHours?.root?.children?.length)

  const hasCoordinates =
    location?.coordinates?.latitude != null && location?.coordinates?.longitude != null

  const contactCards: ContactCardProps[] = []

  if (contact?.website) {
    const displayUrl = contact.website.replace(/^https?:\/\//, '').replace(/\/$/, '')
    contactCards.push({
      icon: <GlobeRegular className="h-6 w-6" />,
      label: websiteLabel,
      value: displayUrl,
      href: contact.website.startsWith('http') ? contact.website : `https://${contact.website}`,
    })
  }

  if (contact?.phone) {
    contactCards.push({
      icon: <CallRegular className="h-6 w-6" />,
      label: phoneLabel,
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, '')}`,
    })
  }

  if (location?.address) {
    contactCards.push({
      icon: <SpriteIcon name="location" className="h-6 w-6" />,
      label: addressLabel,
      value: location.address,
    })
  }

  return (
    <div className={cn('container', className)}>
      <div className="mx-auto max-w-[1340px] flex flex-col gap-20 py-16">
        {/* Top section: Working hours + Contact cards */}
        {(hasWorkingHours || contactCards.length > 0) && (
          <div className={cn('flex flex-col gap-10', hasWorkingHours && 'md:flex-row md:gap-20')}>
            {/* Left: Working hours */}
            {hasWorkingHours && (
              <div className="flex-1">
                <h2 className="font-heading text-4xl font-bold leading-[1.15] text-heading md:text-[60px]">
                  {workingHoursLabel}
                </h2>
                <div className="mt-6">
                  <RichText
                    data={workingHours!}
                    enableGutter={false}
                    className="font-heading text-xl font-semibold leading-[1.2]"
                  />
                </div>
              </div>
            )}

            {/* Right: Contact cards */}
            {contactCards.length > 0 && (
              <div className={cn('flex flex-col gap-6 py-2', hasWorkingHours && 'md:w-[500px]')}>
                {contactCards.map((card, i) => (
                  <ContactCard key={i} {...card} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map */}
        {!hideMap && hasCoordinates && (
          <EmbeddedMap
            className="overflow-hidden rounded-2xl h-[240px] md:h-[720px] animate-pulse bg-grey-100 [&:has(.leaflet-container)]:animate-none [&:has(.leaflet-container)]:bg-transparent"
            viewLabel={labels.viewMap ?? ''}
            closeLabel={labels.closeMap ?? ''}
          >
            {({ interactive }) => (
              <LocationMapClient
                center={[location!.coordinates!.latitude!, location!.coordinates!.longitude!]}
                zoom={15}
                directionsLabel={labels.getDirections}
                interactive={interactive}
              />
            )}
          </EmbeddedMap>
        )}
      </div>
    </div>
  )
}
