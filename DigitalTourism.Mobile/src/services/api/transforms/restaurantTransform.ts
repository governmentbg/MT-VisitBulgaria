/**
 * Restaurant Transformation Layer
 *
 * Converts API Service restaurant responses to app Restaurant model format.
 */

import type {Restaurant} from '../../../models/Restaurant';
import {CategoryType} from '../../../models/Category';
import {extractRelatedExperiences} from './payloadHelpers';
import {createBatchTransform, normalizeTagItems, mapCategory, mapImages, mapBrochures} from './baseTransform';
import type {ApiRestaurantDto} from '../types/apiServiceTypes';

/** Maps full lowercase day names from the CMS to abbreviated day keys used in the app */
const DAY_NAME_TO_KEY: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

function normalizeDays(days: string[]): string[] {
  return days.map(d => DAY_NAME_TO_KEY[d.toLowerCase()] || d);
}

export function transformPayloadRestaurantToApp(data: ApiRestaurantDto): Restaurant {
  const cuisineTypes = normalizeTagItems(data.cuisineTypes || []);
  const dietaryOptions = normalizeTagItems(data.dietaryOptions || []);

  return {
    id: String(data.id),
    slug: data.slug,
    name: data.name || '',
    description: data.content ?? null,
    location: {
      latitude: data.location?.latitude ?? 0,
      longitude: data.location?.longitude ?? 0,
    },
    category: mapCategory(data.category, CategoryType.FOOD),
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
    subtitle: cuisineTypes.map((c) => c.name).join(' • '),
    cuisineTypes,
    dietaryOptions,
    priceRange: data.priceRange,
    workingHours: Array.isArray(data.restaurantHours)
      ? data.restaurantHours.map((h: Record<string, unknown>) => ({days: normalizeDays((h.days as string[]) || []), openTime: (h.openTime as string) || '', closeTime: (h.closeTime as string) || ''}))
      : undefined,
    menuUrl: data.menuUrl,
    reservationUrl: data.reservationUrl || data.bookingUrl,
    bookingUrl: data.bookingUrl,
  };
}

export const transformPayloadRestaurantsToApp = createBatchTransform(transformPayloadRestaurantToApp, 'restaurant');
