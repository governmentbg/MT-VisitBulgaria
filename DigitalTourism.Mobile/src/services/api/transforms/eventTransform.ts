/**
 * Event Transformation Layer
 *
 * Converts API Service event responses to app Event model format.
 * Includes status calculation based on event dates.
 */

import type {Event} from '../../../models/Event';
import {CategoryType} from '../../../models/Category';
import {EventStatus as EventStatusEnum} from '../../../models/Event';
import {extractRelatedExperiences} from './payloadHelpers';
import {createBatchTransform, mapCategory, mapImages, mapBrochures} from './baseTransform';
import {calculateEventStatus} from '../../../utils/dateHelpers';
import type {ApiEventDto} from '../types/apiServiceTypes';

/**
 * Transform an API Service event response to app Event model.
 * Handles both list items (fewer fields) and detail items (full fields).
 */
export function transformPayloadEventToApp(data: ApiEventDto): Event {
  const startDate = data.period?.startDate || '';
  const endDate = data.period?.endDate || '';
  const status =
    startDate && endDate
      ? calculateEventStatus({startDate, endDate})
      : EventStatusEnum.UPCOMING;

  return {
    // BaseEntity fields
    id: String(data.id),
    slug: data.slug,
    name: data.name || '',
    description: data.content ?? null,
    location: {
      latitude: data.location?.latitude ?? 0,
      longitude: data.location?.longitude ?? 0,
    },
    category: mapCategory(data.category, CategoryType.ENTERTAINMENT),
    cityId: data.cityId != null ? String(data.cityId) : undefined,
    cityName: data.cityName,
    images: mapImages(data),
    videos: Array.isArray(data.videos) ? data.videos : [],
    address: data.location?.address,
    phone: data.contact?.phone,
    website: data.contact?.website,
    brochures: mapBrochures(data),
    relatedExperiences: extractRelatedExperiences(data),
    howToGetThere: data.howToGetThere ?? null,
    practicalInfo: data.practicalInfo ?? null,
    infoCenter: data.infoCenter ?? null,
    contactInfo: data.contactInfo ?? null,

    // Event-specific fields
    period: {startDate, endDate},
    status,
    ticketPrice: data.ticketPriceLabel,
    organizer: data.organizer,
    workingHours: undefined,
  };
}

/**
 * Transform an array of API Service event responses to app format.
 */
export const transformPayloadEventsToApp = createBatchTransform(
  transformPayloadEventToApp,
  'event',
);
