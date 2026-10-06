/**
 * Shared helpers for transforming Payload CMS responses to app models.
 *
 * Payload CMS uses:
 * - `title` (not `name`)
 * - `description` as Lexical rich text `{root: {children: [{children: [{text}]}]}}`
 * - `heroImage` + `gallery` (not flat `images` array)
 * - `location.coordinates.{latitude,longitude}` (nested)
 * - `categories` array (not single `category` object)
 * - Relative media URLs (`/api/media/file/xxx.webp`)
 */

import {API_CONFIG} from '../config';
import type {Category} from '../../../models/Category';
import {CategoryType} from '../../../models/Category';

/** Server root URL for resolving relative media paths */
const SERVER_ROOT = API_CONFIG.BASE_URL.replace(/\/api\/?$/, '');

/**
 * Resolve a Payload CMS relative media URL to an absolute URL.
 * Rewrites /api/media/ paths to /api/v1/media/ (served by API Service proxy).
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Rewrite Payload's /api/media/... to API Service's /api/v1/media/...
  const rewritten = url.replace(/^\/api\/media\//, '/api/v1/media/');
  return `${SERVER_ROOT}${rewritten}`;
}

/**
 * Extract an array of absolute image URLs from heroImage + gallery.
 */
export function extractImages(payload: Record<string, unknown>): string[] {
  const urls: string[] = [];

  // Hero image first
  const heroImage = payload.heroImage as Record<string, unknown> | null | undefined;
  if (heroImage && typeof heroImage === 'object') {
    const sizes = heroImage.sizes as Record<string, Record<string, string>> | undefined;
    const heroUrl =
      sizes?.medium?.url ||
      sizes?.small?.url ||
      (heroImage.url as string | undefined);
    if (heroUrl) urls.push(resolveMediaUrl(heroUrl));
  }

  // Gallery images
  if (Array.isArray(payload.gallery)) {
    for (const item of payload.gallery) {
      const itemObj = item as Record<string, unknown>;
      const img = typeof item === 'object' ? (itemObj.image || item) : item;
      if (img && typeof img === 'object') {
        const imgObj = img as Record<string, unknown>;
        const sizes = imgObj.sizes as Record<string, Record<string, string>> | undefined;
        const url = sizes?.medium?.url || sizes?.small?.url || (imgObj.url as string | undefined);
        if (url) urls.push(resolveMediaUrl(url));
      }
    }
  }

  return urls;
}

/**
 * Extract plain text from a Payload CMS Lexical rich text field.
 */
export function extractPlainText(description: unknown): string {
  if (typeof description === 'string') return description;
  if (!description || typeof description !== 'object') return '';

  try {
    const desc = description as Record<string, unknown>;
    const root = (desc.root || description) as Record<string, unknown>;
    if (!root.children) return '';

    const texts: string[] = [];
    const walk = (node: Record<string, unknown>) => {
      if (node.text) texts.push(node.text as string);
      if (Array.isArray(node.children)) {
        for (const child of node.children) walk(child as Record<string, unknown>);
      }
    };
    walk(root);
    return texts.join(' ').trim();
  } catch {
    return '';
  }
}

/**
 * Extract flat location from Payload CMS nested location.
 * Payload: `{address, coordinates: {latitude, longitude}}`
 * App:     `{latitude, longitude, address}`
 */
export function extractLocation(location: unknown): {
  latitude: number;
  longitude: number;
  address?: string;
} {
  if (!location || typeof location !== 'object') return {latitude: 0, longitude: 0};

  const loc = location as Record<string, unknown>;

  // Handle nested coordinates
  if (loc.coordinates && typeof loc.coordinates === 'object') {
    const coords = loc.coordinates as Record<string, unknown>;
    return {
      latitude: (coords.latitude as number) ?? 0,
      longitude: (coords.longitude as number) ?? 0,
      address: loc.address as string | undefined,
    };
  }

  // Handle flat format (already correct)
  return {
    latitude: (loc.latitude as number) ?? 0,
    longitude: (loc.longitude as number) ?? 0,
    address: loc.address as string | undefined,
  };
}

/**
 * Extract first category from Payload CMS categories array.
 */
export function extractCategory(
  payload: Record<string, unknown>,
  fallbackType: string = 'CULTURAL',
  fallbackName?: string,
): Category {
  const cats = payload.categories as unknown[] | undefined;
  if (Array.isArray(cats) && cats.length > 0) {
    const cat = typeof cats[0] === 'object' ? (cats[0] as Record<string, unknown>) : null;
    if (cat) {
      return {
        id: String(cat.id),
        name: (cat.name as string) || (cat.title as string) || fallbackName || fallbackType,
        type: ((cat.type as string) || fallbackType) as CategoryType,
        icon: (cat.icon as string) || 'help-circle',
        color: (cat.color as string) || '#999999',
      };
    }
  }

  return {
    id: 'other',
    name: 'common:category.other',
    type: fallbackType as CategoryType,
    icon: 'help-circle',
    color: '#999999',
  };
}

/**
 * Extract video data from Payload CMS videos array.
 */
export function extractVideos(payload: Record<string, unknown>): Array<{url: string; title?: string}> {
  if (!Array.isArray(payload.videos)) return [];
  return payload.videos
    .map((v: unknown) => {
      const video = typeof v === 'object' && v !== null ? (v as Record<string, unknown>) : null;
      if (!video) return null;
      const url = (video.url as string) || (video.videoUrl as string) || '';
      if (!url) return null;
      return { url, title: video.title as string | undefined };
    })
    .filter((v): v is {url: string; title: string | undefined} => v != null);
}

/**
 * Extract city ID from populated or raw relationship.
 */
export function extractCityId(city: unknown): string | undefined {
  if (!city) return undefined;
  if (typeof city === 'object') return String((city as Record<string, unknown>).id);
  return String(city);
}

/**
 * Extract brochures from Payload CMS brochures array.
 * Each brochure has a media relationship with url, filename, filesize.
 */
export function extractBrochures(payload: Record<string, unknown>): Array<{url: string; title: string; filesize?: number}> {
  if (!Array.isArray(payload.brochures)) return [];
  return payload.brochures
    .map((b: unknown) => {
      if (!b || typeof b !== 'object') return null;
      const bObj = b as Record<string, unknown>;
      // Brochure can be a direct media object or have a nested file/document
      const rawFile = bObj.file || bObj.document || b;
      if (!rawFile || typeof rawFile !== 'object') return null;
      const file = rawFile as Record<string, unknown>;
      const url = file.url as string | undefined;
      if (!url) return null;
      return {
        url: resolveMediaUrl(url),
        title: (bObj.title as string) || (file.filename as string) || 'Document',
        filesize: file.filesize as number | undefined,
      };
    })
    .filter(Boolean) as Array<{url: string; title: string; filesize?: number}>;
}

/**
 * Extract related experiences from Payload CMS polymorphic relationships.
 * Payload format: `[{relationTo: "hotels", value: {id, title, heroImage}}]`
 */
export function extractRelatedExperiences(payload: Record<string, unknown>): Array<{
  id: string;
  name: string;
  type: string;
  imageUrl?: string;
}> {
  if (!Array.isArray(payload.relatedExperiences)) return [];
  return payload.relatedExperiences
    .map((rel: unknown) => {
      if (!rel || typeof rel !== 'object') return null;
      const relObj = rel as Record<string, unknown>;
      if (!relObj.relationTo || !relObj.value) return null;
      const val = typeof relObj.value === 'object' && relObj.value !== null
        ? (relObj.value as Record<string, unknown>)
        : null;
      if (!val || !val.id) return null;
      const heroImage = val.heroImage as Record<string, unknown> | undefined;
      const sizes = heroImage?.sizes as Record<string, Record<string, string>> | undefined;
      const heroUrl = sizes?.thumbnail?.url || (heroImage?.url as string | undefined);
      return {
        id: String(val.id),
        name: (val.title as string) || (val.name as string) || '',
        type: relObj.relationTo as string,
        imageUrl: heroUrl ? resolveMediaUrl(heroUrl) : undefined,
      };
    })
    .filter(Boolean) as Array<{id: string; name: string; type: string; imageUrl?: string}>;
}
