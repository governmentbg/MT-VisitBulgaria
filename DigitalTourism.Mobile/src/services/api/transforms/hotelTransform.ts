/**
 * Hotel Transformation Layer
 *
 * Converts API Service hotel responses to app Hotel model format.
 */

import type {Hotel} from '../../../models/Hotel';
import {CategoryType} from '../../../models/Category';
import {extractRelatedExperiences} from './payloadHelpers';
import {createBatchTransform, normalizeTagItems, mapCategory, mapImages, mapBrochures} from './baseTransform';
import type {ApiHotelDto} from '../types/apiServiceTypes';

export function transformPayloadHotelToApp(data: ApiHotelDto): Hotel {
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
    starRating: data.starRating ?? 0,
    rooms: data.rooms,
    amenities: normalizeTagItems(data.amenities || []),
    checkInTime: data.checkInTime,
    checkOutTime: data.checkOutTime,
    workingHours: undefined,
    bookingUrl: data.bookingUrl,
  };
}

export const transformPayloadHotelsToApp = createBatchTransform(transformPayloadHotelToApp, 'hotel');
