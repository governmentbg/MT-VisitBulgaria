/**
 * Attraction Transformation Layer
 *
 * Converts API Service attraction responses to app Attraction model format.
 * The API Service returns pre-processed DTOs — these transforms perform
 * final mapping to the app's BaseEntity/Attraction interface.
 */

import type {Attraction} from '../../../models/Attraction';
import {CategoryType} from '../../../models/Category';
import {extractRelatedExperiences} from './payloadHelpers';
import {createBatchTransform, mapCategory, mapImages, mapBrochures} from './baseTransform';
import type {ApiAttractionDto} from '../types/apiServiceTypes';

/**
 * Transform an API Service attraction response to app Attraction model.
 * Handles both list items (fewer fields) and detail items (full fields).
 */
export function transformPayloadAttractionToApp(data: ApiAttractionDto): Attraction {
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
    category: mapCategory(data.category, CategoryType.CULTURAL),
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

    // Attraction-specific fields
    audioGuide: undefined,
    audioGuides: undefined,
    rating: 0,
    visitDuration: data.visitDuration ?? 0,
    openingHours: data.workingHours ?? null,
    ticketPrice: undefined,
  };
}

/**
 * Transform an array of API Service attraction responses to app format.
 */
export const transformPayloadAttractionsToApp = createBatchTransform(
  transformPayloadAttractionToApp,
  'attraction',
);
