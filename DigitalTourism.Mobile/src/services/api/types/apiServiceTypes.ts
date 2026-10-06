/**
 * Shared types for .NET API Service responses.
 */

import type {PaginationMeta} from '../transforms';
import type {LexicalRoot} from './lexical';

// ---------------------------------------------------------------------------
// .NET API Service DTO types
// ---------------------------------------------------------------------------

/** Fields shared across all .NET API Service entity DTOs */
export interface ApiEntityDtoBase {
  [key: string]: unknown;
  id: string | number;
  slug?: string;
  name?: string;
  title?: string;
  description?: string | LexicalRoot | null;
  content?: LexicalRoot | null;
  location?: {latitude: number; longitude: number; address?: string};
  category?: {id: string | number; name?: string; title?: string; type?: string; icon?: string; color?: string};
  cityId?: number | string;
  cityName?: string;
  city?: {id: number; name: string; municipality?: {name: string}} | number;
  images?: unknown[];
  imageUrl?: string;
  videos?: Array<{url: string; title?: string}>;
  contact?: {phone?: string; email?: string; website?: string};
  address?: string;
  brochures?: unknown[];
  relatedExperiences?: unknown[];
  howToGetThere?: LexicalRoot | null;
  practicalInfo?: LexicalRoot | null;
  infoCenter?: LexicalRoot | null;
  contactInfo?: LexicalRoot | null;
  contactInfoRichText?: LexicalRoot | null;
}

export interface ApiAttractionDto extends ApiEntityDtoBase {
  visitDuration?: number;
  attractionHours?: string;
  workingHours?: LexicalRoot | null;
  audioGuide?: unknown;
  audioGuides?: unknown[];
}

export interface ApiEventDto extends ApiEntityDtoBase {
  period?: {startDate: string; endDate: string};
  ticketPriceLabel?: number;
  organizer?: string;
  workingHours?: LexicalRoot | null;
}

export interface ApiHotelDto extends ApiEntityDtoBase {
  starRating?: number;
  rooms?: number;
  amenities?: unknown[];
  checkInTime?: string;
  checkOutTime?: string;
  bookingUrl?: string;
}

export interface ApiRestaurantDto extends ApiEntityDtoBase {
  cuisineTypes?: unknown[];
  dietaryOptions?: unknown[];
  priceRange?: string;
  restaurantHours?: Array<{days?: string[]; openTime?: string; closeTime?: string}>;
  menuUrl?: string;
  reservationUrl?: string;
  bookingUrl?: string;
}

export interface ApiActivityDto extends ApiEntityDtoBase {
  duration?: string;
  difficultyLevel?: unknown;
  seasonality?: unknown[];
  minimumAge?: number;
  groupSize?: {min: number; max: number};
  equipmentProvided?: boolean;
  whatToBring?: string;
  includes?: unknown[];
  bookingUrl?: string;
}

/** Response shape from the API Service list endpoints */
export interface ApiListResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Maps API Service pagination fields to the app's PaginationMeta format */
export function mapApiPagination(paging: Omit<ApiListResponse<unknown>, 'data'>): PaginationMeta {
  return {
    totalDocs: paging.total,
    limit: paging.limit,
    totalPages: paging.totalPages,
    page: paging.page,
    hasNextPage: paging.hasNextPage,
    hasPrevPage: paging.hasPrevPage,
    nextPage: paging.hasNextPage ? paging.page + 1 : null,
    prevPage: paging.hasPrevPage ? paging.page - 1 : null,
  };
}
