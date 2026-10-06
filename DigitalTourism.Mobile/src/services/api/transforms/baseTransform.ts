/**
 * Base Transform Utilities
 *
 * Shared field extraction and batch transform factory for all entity types.
 * Each entity transform calls extractBaseFields() then merges entity-specific fields.
 */

import type {Category} from '../../../models/Category';
import {CategoryType} from '../../../models/Category';
import type {TagItem} from '../../../types/common';
import {
  resolveMediaUrl,
} from './payloadHelpers';

/**
 * Normalize a raw array of objects or strings into TagItem[].
 * Handles Payload CMS responses where items can be populated objects or bare string IDs.
 */
export function normalizeTagItems(raw: unknown[]): TagItem[] {
  return (raw || [])
    .map((x: unknown) => {
      if (typeof x === 'object' && x !== null) {
        const obj = x as Record<string, unknown>;
        return {id: obj.id as string, name: (obj.name as string) || (obj.title as string)};
      }
      if (typeof x === 'string') return {id: x, name: x};
      return null;
    })
    .filter((x): x is TagItem => x !== null);
}

/**
 * Normalize a single raw value (object or string) into a TagItem or undefined.
 */
export function normalizeTagItem(raw: unknown): TagItem | undefined {
  if (!raw) return undefined;
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    return {id: obj.id as string, name: (obj.name as string) || (obj.title as string)};
  }
  if (typeof raw === 'string') return {id: raw, name: raw};
  return undefined;
}

/**
 * Factory for the batch transform pattern (try/catch/filter).
 * Replaces the identical transformPayloadXsToApp functions across all entities.
 */
export function createBatchTransform<T, D = unknown>(
  transformOne: (data: D) => T,
  entityLabel: string,
): (data: D[]) => T[] {
  return (payloadData: D[]): T[] =>
    payloadData
      .map(item => {
        try {
          return transformOne(item);
        } catch (error) {
          if (__DEV__) {
            const itemId = typeof item === 'object' && item !== null ? (item as Record<string, unknown>).id : item;
            console.error(`[Transform] Failed to transform ${entityLabel}:`, itemId, error);
          } else {
            console.error(`[Transform] ${entityLabel} transform failed:`, error instanceof Error ? error.message : 'unknown');
          }
          return null;
        }
      })
      .filter((item): item is T => item !== null);
}

/**
 * Map an API Service category DTO to the app's Category model.
 * Shared across all entity transforms.
 */
export function mapCategory(cat: unknown, fallbackType: string): Category {
  if (cat && typeof cat === 'object') {
    const c = cat as Record<string, unknown>;
    return {
      id: String(c.id),
      name: (c.title as string) || (c.name as string) || 'Other',
      type: fallbackType as CategoryType,
      icon: (c.icon as string) || 'help-circle',
      color: (c.color as string) || '#999999',
    };
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
 * Extract image URLs from either a list item (imageUrl) or detail item (images array).
 * Shared across all entity transforms.
 */
export function mapImages(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.images) && data.images.length > 0) {
    return data.images
      .map((img: unknown) => (typeof img === 'string' ? img : resolveMediaUrl((img as Record<string, unknown>).url as string)))
      .filter(Boolean) as string[];
  }
  if (data.imageUrl) {
    return [resolveMediaUrl(data.imageUrl as string)];
  }
  return [];
}

/**
 * Map brochure DTOs to app format.
 * Shared across all entity transforms.
 */
export function mapBrochures(data: Record<string, unknown>): {url: string; title: string}[] {
  if (!Array.isArray(data.brochures)) return [];
  return data.brochures.map((b: Record<string, unknown>) => ({
    url: resolveMediaUrl(b.url as string),
    title: (b.title as string) || (b.filename as string) || 'Document',
  }));
}
