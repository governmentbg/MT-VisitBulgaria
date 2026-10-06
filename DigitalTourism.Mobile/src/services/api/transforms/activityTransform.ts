/**
 * Activity Transformation Layer
 *
 * Converts API Service activity responses to app Activity model format.
 */

import type {Activity} from '../../../models/Activity';
import {CategoryType} from '../../../models/Category';
import {extractRelatedExperiences} from './payloadHelpers';
import {createBatchTransform, normalizeTagItems, normalizeTagItem, mapCategory, mapImages, mapBrochures} from './baseTransform';
import type {ApiActivityDto} from '../types/apiServiceTypes';

export function transformPayloadActivityToApp(data: ApiActivityDto): Activity {
  const difficultyLevel = normalizeTagItem(data.difficultyLevel);
  const seasonality = normalizeTagItems(data.seasonality || []);

  return {
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
    contactInfo: data.contactInfoRichText ?? null,
    email: data.contact?.email,
    duration: data.duration,
    difficultyLevel,
    seasonality,
    minimumAge: data.minimumAge,
    groupSize: data.groupSize,
    equipmentProvided: data.equipmentProvided,
    whatToBring: data.whatToBring,
    includes: (data.includes || [])
      .map((i: unknown) => typeof i === 'object' && i !== null ? {label: (i as Record<string, unknown>).label as string || ''} : typeof i === 'string' ? {label: i} : null)
      .filter((x): x is {label: string} => x !== null),
    workingHours: undefined,
    bookingUrl: data.bookingUrl,
  };
}

export const transformPayloadActivitiesToApp = createBatchTransform(transformPayloadActivityToApp, 'activity');
