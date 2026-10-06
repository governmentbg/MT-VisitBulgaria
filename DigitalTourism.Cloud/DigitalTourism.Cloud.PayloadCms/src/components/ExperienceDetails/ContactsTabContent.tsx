import React from 'react'
import type { DeepExperience } from '@/lib/payloadData'
import { WorkingHoursAndContacts, LocationMap } from './WorkingHoursAndContacts'
import { RichTextSection } from './RichTextSection'

export interface ContactsTabContentProps {
  experience: DeepExperience
  labels: {
    workingHours: string
    website: string
    phone: string
    address: string
    getDirections: string
    infoCenter: string
    contactInfo: string
    viewMap: string
    closeMap: string
  }
}

export function ContactsTabContent({ experience, labels }: ContactsTabContentProps) {
  return (
    <>
      <WorkingHoursAndContacts
        workingHours={experience.workingHours}
        contact={experience.contact}
        location={experience.location}
        hideMap
        labels={{
          workingHours: labels.workingHours,
          website: labels.website,
          phone: labels.phone,
          address: labels.address,
          getDirections: labels.getDirections,
          viewMap: labels.viewMap,
          closeMap: labels.closeMap,
        }}
      />

      <RichTextSection
        data={experience.infoCenter}
        heading={labels.infoCenter}
        variant="contacts"
      />

      <RichTextSection
        data={experience.contactInfo}
        heading={labels.contactInfo}
        variant="contacts"
      />

      {experience.location?.coordinates?.latitude != null &&
        experience.location?.coordinates?.longitude != null && (
          <LocationMap
            coordinates={
              experience.location.coordinates as { latitude: number; longitude: number }
            }
            directionsLabel={labels.getDirections}
            viewMapLabel={labels.viewMap}
            closeMapLabel={labels.closeMap}
            className="pb-16"
          />
        )}
    </>
  )
}
