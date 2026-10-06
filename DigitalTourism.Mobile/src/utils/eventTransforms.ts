import {EventStatus, Event} from '../models/Event';
import {CategoryType} from '../models/Category';
import type {ExperienceSearchResult} from '../services/api/types/searchTypes';
import {stripTypesenseId} from './searchHitTransforms';
import {resolveMediaUrl} from '../services/api/transforms/payloadHelpers';
import {palette} from '../theme/palette';
import {plainTextToLexicalRoot} from '../services/api/types/lexical';

export const STATUS_VALUES = new Set<string>([
  EventStatus.ACTIVE,
  EventStatus.UPCOMING,
  EventStatus.PAST,
]);

/** Parse ISO string to ms; returns undefined for missing/invalid values. */
function toMs(iso?: string): number | undefined {
  if (!iso) return undefined;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : undefined;
}

/** Compute event status from an ExperienceSearchResult's `date` / `endDate`. */
export function computeEventStatus(hit: ExperienceSearchResult): EventStatus {
  const now = Date.now();
  const start = toMs(hit.date);
  const end = toMs(hit.endDate);
  if (start !== undefined && now < start) return EventStatus.UPCOMING;
  if (end !== undefined && now > end) return EventStatus.PAST;
  return EventStatus.ACTIVE;
}

/**
 * Transform a search hit into an Event-like object compatible with
 * EventCard / EventsList.
 */
export function hitToEvent(hit: ExperienceSearchResult): Event {
  const status = computeEventStatus(hit);
  const coords = hit.location?.coordinates;
  const startDate = hit.date ?? new Date().toISOString();
  const endDate = hit.endDate ?? startDate;

  return {
    id: stripTypesenseId(hit.id),
    name: hit.title,
    description: plainTextToLexicalRoot(hit.description),
    location: {
      latitude: coords?.latitude ?? 0,
      longitude: coords?.longitude ?? 0,
    },
    category: {
      id: hit.categories?.[0] || '',
      name: hit.categories?.[0] || '',
      type: CategoryType.ENTERTAINMENT,
      icon: 'calendar',
      color: palette.green500,
    },
    period: {startDate, endDate},
    status,
    images: hit.heroImage?.url ? [resolveMediaUrl(hit.heroImage.url)] : [],
    videos: [],
    brochures: [],
    relatedExperiences: [],
    organizer: hit.organizer,
    address: hit.location?.city || '',
  };
}
