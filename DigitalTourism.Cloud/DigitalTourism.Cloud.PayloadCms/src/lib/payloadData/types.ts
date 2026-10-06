/**
 * Generic Depth-Aware Type Utilities for Payload CMS
 *
 * These utilities transform Payload CMS relationship types based on the depth parameter.
 * Works with ANY Payload collection.
 *
 * How depth affects relationships:
 * - Depth 0: All relationships are IDs (number)
 * - Depth 1: Direct relationships are populated, nested refs remain IDs
 * - Depth 2: Direct + one level of nested relationships are populated
 * - Depth 3+: Continue nesting as needed
 *
 * Example:
 * ```typescript
 * // Hotel with city relationship
 * type ShallowHotel = DocumentAtDepth<Hotel, 0>  // city: number
 * type DeepHotel = DocumentAtDepth<Hotel, 2>     // city: { name: string, municipality: { name: string, ... } }
 * ```
 */

import type {
  Hotel,
  Restaurant,
  Activity,
  Attraction,
  Event,
  Page,
  City,
  Municipality,
  Region,
  Media,
  Category,
  Tag,
  User,
  Amenity,
  CuisineType,
  DietaryOption,
  Season,
  DifficultyLevel,
} from '@/payload-types'

/**
 * Supported depth levels
 */
export type Depth = 0 | 1 | 2 | 3 | 4

/**
 * Extract the object type from a Payload relationship union (number | T)
 * Example: ExtractRelationType<number | City> = City
 */
type ExtractRelationType<T> = T extends number | infer U ? (U extends object ? U : never) : never

/**
 * Transform a simple relationship field based on depth
 * - Depth 0: number (ID)
 * - Depth 1+: Full object T
 */
export type RelationAtDepth<T, D extends Depth> = D extends 0 ? number : T

/**
 * Transform an optional relationship field based on depth
 */
export type OptionalRelationAtDepth<T, D extends Depth> = D extends 0
  ? number | null
  : T | null

/**
 * Transform an array relationship based on depth
 * Example: (number | Category)[] | null
 */
export type ArrayRelationAtDepth<T, D extends Depth> = D extends 0
  ? number[] | null
  : T[] | null

/**
 * Transform a polymorphic relationship based on depth
 * Example: { relationTo: 'hotels', value: number | Hotel } | { relationTo: 'restaurants', value: number | Restaurant }
 */
export type PolymorphicRelationAtDepth<
  Relations extends { relationTo: string; value: any },
  D extends Depth,
> = D extends 0
  ? {
      [K in Relations as K['relationTo']]: {
        relationTo: K['relationTo']
        value: number
      }
    }[Relations['relationTo']]
  : {
      [K in Relations as K['relationTo']]: {
        relationTo: K['relationTo']
        value: ExtractRelationType<K['value']>
      }
    }[Relations['relationTo']]

/**
 * Geography type helpers - handles the Region -> Municipality -> City hierarchy
 */

/**
 * Region type at different depths (Region has no nested relationships)
 */
export type RegionAtDepth<D extends Depth> = D extends 0 ? number : Region

/**
 * Municipality type at different depths
 * - Depth 0: number
 * - Depth 1: Municipality with region as number
 * - Depth 2+: Municipality with region as Region object
 */
export type MunicipalityAtDepth<D extends Depth> = D extends 0
  ? number
  : D extends 1
  ? Omit<Municipality, 'region'> & { region: number }
  : Municipality & { region: Region }

/**
 * City type at different depths
 * - Depth 0: number
 * - Depth 1: City with municipality as number
 * - Depth 2: City with municipality populated, but municipality.region as number
 * - Depth 3+: City with full municipality and region populated
 */
export type CityAtDepth<D extends Depth> = D extends 0
  ? number
  : D extends 1
  ? Omit<City, 'municipality' | 'heroImage'> & {
      municipality: number
      heroImage?: number | null
    }
  : D extends 2
  ? Omit<City, 'municipality' | 'heroImage'> & {
      municipality: Omit<Municipality, 'region' | 'heroImage'> & {
        region: number
        heroImage?: number | null
      }
      heroImage?: number | Media | null
    }
  : Omit<City, 'municipality' | 'heroImage'> & {
      municipality: Omit<Municipality, 'region' | 'heroImage'> & {
        region: Region & { heroImage?: number | Media | null }
        heroImage?: number | Media | null
      }
      heroImage?: number | Media | null
    }

/**
 * Generic document type with depth applied
 * This is a simplified version - for production use, you'd need to map each field
 * based on whether it's a relationship or not.
 *
 * Usage:
 * ```typescript
 * type HotelDepth0 = DocumentAtDepth<Hotel, 0>
 * type HotelDepth2 = DocumentAtDepth<Hotel, 2>
 * ```
 */
export type DocumentAtDepth<T, _D extends Depth> = T

/**
 * Experience-specific type aliases for convenience
 * These use the generic DocumentAtDepth but can be extended with specific field mappings
 */
export type HotelAtDepth<D extends Depth> = D extends 0
  ? Omit<
      Hotel,
      | 'city'
      | 'heroImage'
      | 'categories'
      | 'tags'
      | 'relatedExperiences'
      | 'gallery'
      | 'amenities'
      | 'createdBy'
    > & {
      city: number
      heroImage: number
      categories?: number[] | null
      tags?: number[] | null
      relatedExperiences?:
        | (
            | { relationTo: 'hotels'; value: number }
            | { relationTo: 'restaurants'; value: number }
            | { relationTo: 'activities'; value: number }
            | { relationTo: 'attractions'; value: number }
            | { relationTo: 'events'; value: number }
          )[]
        | null
      gallery?: number[] | null
      amenities?: number[] | null
      createdBy?: number | null
    }
  : Omit<
      Hotel,
      | 'city'
      | 'heroImage'
      | 'categories'
      | 'tags'
      | 'relatedExperiences'
      | 'gallery'
      | 'amenities'
      | 'createdBy'
    > & {
      city: CityAtDepth<D extends 0 ? 0 : D extends 1 ? 1 : D extends 2 ? 2 : 3>
      heroImage: D extends 1 ? number | Media : Media
      categories?: (D extends 1 ? number | Category : Category)[] | null
      tags?: (D extends 1 ? number | Tag : Tag)[] | null
      relatedExperiences?:
        | (
            | { relationTo: 'hotels'; value: D extends 1 ? number | Hotel : Hotel }
            | { relationTo: 'restaurants'; value: D extends 1 ? number | Restaurant : Restaurant }
            | { relationTo: 'activities'; value: D extends 1 ? number | Activity : Activity }
            | { relationTo: 'attractions'; value: D extends 1 ? number | Attraction : Attraction }
            | { relationTo: 'events'; value: D extends 1 ? number | Event : Event }
          )[]
        | null
      gallery?: (D extends 1 ? number | Media : Media)[] | null
      amenities?: (D extends 1 ? number | Amenity : Amenity)[] | null
      createdBy?: (D extends 1 ? number | User : User) | null
    }

export type RestaurantAtDepth<D extends Depth> = D extends 0
  ? Omit<
      Restaurant,
      | 'city'
      | 'heroImage'
      | 'categories'
      | 'tags'
      | 'relatedExperiences'
      | 'gallery'
      | 'cuisineTypes'
      | 'dietaryOptions'
      | 'createdBy'
    > & {
      city: number
      heroImage: number
      categories?: number[] | null
      tags?: number[] | null
      relatedExperiences?:
        | (
            | { relationTo: 'hotels'; value: number }
            | { relationTo: 'restaurants'; value: number }
            | { relationTo: 'activities'; value: number }
            | { relationTo: 'attractions'; value: number }
            | { relationTo: 'events'; value: number }
          )[]
        | null
      gallery?: number[] | null
      cuisineTypes?: number[] | null
      dietaryOptions?: number[] | null
      createdBy?: number | null
    }
  : Omit<
      Restaurant,
      | 'city'
      | 'heroImage'
      | 'categories'
      | 'tags'
      | 'relatedExperiences'
      | 'gallery'
      | 'cuisineTypes'
      | 'dietaryOptions'
      | 'createdBy'
    > & {
      city: CityAtDepth<D extends 0 ? 0 : D extends 1 ? 1 : D extends 2 ? 2 : 3>
      heroImage: D extends 1 ? number | Media : Media
      categories?: (D extends 1 ? number | Category : Category)[] | null
      tags?: (D extends 1 ? number | Tag : Tag)[] | null
      relatedExperiences?:
        | (
            | { relationTo: 'hotels'; value: D extends 1 ? number | Hotel : Hotel }
            | { relationTo: 'restaurants'; value: D extends 1 ? number | Restaurant : Restaurant }
            | { relationTo: 'activities'; value: D extends 1 ? number | Activity : Activity }
            | { relationTo: 'attractions'; value: D extends 1 ? number | Attraction : Attraction }
            | { relationTo: 'events'; value: D extends 1 ? number | Event : Event }
          )[]
        | null
      gallery?: (D extends 1 ? number | Media : Media)[] | null
      cuisineTypes?: (D extends 1 ? number | CuisineType : CuisineType)[] | null
      dietaryOptions?: (D extends 1 ? number | DietaryOption : DietaryOption)[] | null
      createdBy?: (D extends 1 ? number | User : User) | null
    }

export type ActivityAtDepth<D extends Depth> = D extends 0
  ? Omit<
      Activity,
      | 'city'
      | 'heroImage'
      | 'categories'
      | 'tags'
      | 'relatedExperiences'
      | 'gallery'
      | 'seasonality'
      | 'difficultyLevel'
      | 'createdBy'
    > & {
      city: number
      heroImage: number
      categories?: number[] | null
      tags?: number[] | null
      relatedExperiences?:
        | (
            | { relationTo: 'hotels'; value: number }
            | { relationTo: 'restaurants'; value: number }
            | { relationTo: 'activities'; value: number }
            | { relationTo: 'attractions'; value: number }
            | { relationTo: 'events'; value: number }
          )[]
        | null
      gallery?: number[] | null
      seasonality?: number[] | null
      difficultyLevel?: number | null
      createdBy?: number | null
    }
  : Omit<
      Activity,
      | 'city'
      | 'heroImage'
      | 'categories'
      | 'tags'
      | 'relatedExperiences'
      | 'gallery'
      | 'seasonality'
      | 'difficultyLevel'
      | 'createdBy'
    > & {
      city: CityAtDepth<D extends 0 ? 0 : D extends 1 ? 1 : D extends 2 ? 2 : 3>
      heroImage: D extends 1 ? number | Media : Media
      categories?: (D extends 1 ? number | Category : Category)[] | null
      tags?: (D extends 1 ? number | Tag : Tag)[] | null
      relatedExperiences?:
        | (
            | { relationTo: 'hotels'; value: D extends 1 ? number | Hotel : Hotel }
            | { relationTo: 'restaurants'; value: D extends 1 ? number | Restaurant : Restaurant }
            | { relationTo: 'activities'; value: D extends 1 ? number | Activity : Activity }
            | { relationTo: 'attractions'; value: D extends 1 ? number | Attraction : Attraction }
            | { relationTo: 'events'; value: D extends 1 ? number | Event : Event }
          )[]
        | null
      gallery?: (D extends 1 ? number | Media : Media)[] | null
      seasonality?: (D extends 1 ? number | Season : Season)[] | null
      difficultyLevel?: (D extends 1 ? number | DifficultyLevel : DifficultyLevel) | null
      createdBy?: (D extends 1 ? number | User : User) | null
    }

export type AttractionAtDepth<D extends Depth> = D extends 0
  ? Omit<
      Attraction,
      | 'city'
      | 'heroImage'
      | 'categories'
      | 'tags'
      | 'relatedExperiences'
      | 'gallery'
      | 'createdBy'
    > & {
      city: number
      heroImage: number
      categories?: number[] | null
      tags?: number[] | null
      relatedExperiences?:
        | (
            | { relationTo: 'hotels'; value: number }
            | { relationTo: 'restaurants'; value: number }
            | { relationTo: 'activities'; value: number }
            | { relationTo: 'attractions'; value: number }
            | { relationTo: 'events'; value: number }
          )[]
        | null
      gallery?: number[] | null
      createdBy?: number | null
    }
  : Omit<
      Attraction,
      | 'city'
      | 'heroImage'
      | 'categories'
      | 'tags'
      | 'relatedExperiences'
      | 'gallery'
      | 'createdBy'
    > & {
      city: CityAtDepth<D extends 0 ? 0 : D extends 1 ? 1 : D extends 2 ? 2 : 3>
      heroImage: D extends 1 ? number | Media : Media
      categories?: (D extends 1 ? number | Category : Category)[] | null
      tags?: (D extends 1 ? number | Tag : Tag)[] | null
      relatedExperiences?:
        | (
            | { relationTo: 'hotels'; value: D extends 1 ? number | Hotel : Hotel }
            | { relationTo: 'restaurants'; value: D extends 1 ? number | Restaurant : Restaurant }
            | { relationTo: 'activities'; value: D extends 1 ? number | Activity : Activity }
            | { relationTo: 'attractions'; value: D extends 1 ? number | Attraction : Attraction }
            | { relationTo: 'events'; value: D extends 1 ? number | Event : Event }
          )[]
        | null
      gallery?: (D extends 1 ? number | Media : Media)[] | null
      createdBy?: (D extends 1 ? number | User : User) | null
    }

export type EventAtDepth<D extends Depth> = D extends 0
  ? Omit<
      Event,
      | 'city'
      | 'heroImage'
      | 'categories'
      | 'tags'
      | 'relatedExperiences'
      | 'gallery'
      | 'createdBy'
    > & {
      city: number
      heroImage: number
      categories?: number[] | null
      tags?: number[] | null
      relatedExperiences?:
        | (
            | { relationTo: 'hotels'; value: number }
            | { relationTo: 'restaurants'; value: number }
            | { relationTo: 'activities'; value: number }
            | { relationTo: 'attractions'; value: number }
            | { relationTo: 'events'; value: number }
          )[]
        | null
      gallery?: number[] | null
      createdBy?: number | null
    }
  : Omit<
      Event,
      | 'city'
      | 'heroImage'
      | 'categories'
      | 'tags'
      | 'relatedExperiences'
      | 'gallery'
      | 'createdBy'
    > & {
      city: CityAtDepth<D extends 0 ? 0 : D extends 1 ? 1 : D extends 2 ? 2 : 3>
      heroImage: D extends 1 ? number | Media : Media
      categories?: (D extends 1 ? number | Category : Category)[] | null
      tags?: (D extends 1 ? number | Tag : Tag)[] | null
      relatedExperiences?:
        | (
            | { relationTo: 'hotels'; value: D extends 1 ? number | Hotel : Hotel }
            | { relationTo: 'restaurants'; value: D extends 1 ? number | Restaurant : Restaurant }
            | { relationTo: 'activities'; value: D extends 1 ? number | Activity : Activity }
            | { relationTo: 'attractions'; value: D extends 1 ? number | Attraction : Attraction }
            | { relationTo: 'events'; value: D extends 1 ? number | Event : Event }
          )[]
        | null
      gallery?: (D extends 1 ? number | Media : Media)[] | null
      createdBy?: (D extends 1 ? number | User : User) | null
    }

/**
 * Union type for any experience with depth applied
 */
export type AnyExperienceAtDepth<D extends Depth> =
  | HotelAtDepth<D>
  | RestaurantAtDepth<D>
  | ActivityAtDepth<D>
  | AttractionAtDepth<D>
  | EventAtDepth<D>

/**
 * Page type with depth applied
 */
export type PageAtDepth<D extends Depth> = D extends 0
  ? Omit<Page, 'heroImage'> & {
      heroImage?: number | null
    }
  : Omit<Page, 'heroImage'> & {
      heroImage?: Media | null
    }

/**
 * Convenience aliases for detail pages (depth 2)
 * Use these in components that expect fully populated experience data
 */
export type DeepHotel = HotelAtDepth<2>
export type DeepRestaurant = RestaurantAtDepth<2>
export type DeepActivity = ActivityAtDepth<2>
export type DeepAttraction = AttractionAtDepth<2>
export type DeepEvent = EventAtDepth<2>
export type DeepExperience = AnyExperienceAtDepth<2>

/**
 * Convenience aliases for list/card views (depth 1)
 * Use these in components that only need basic relationship data
 */
export type ShallowHotel = HotelAtDepth<1>
export type ShallowRestaurant = RestaurantAtDepth<1>
export type ShallowActivity = ActivityAtDepth<1>
export type ShallowAttraction = AttractionAtDepth<1>
export type ShallowEvent = EventAtDepth<1>
export type ShallowExperience = AnyExperienceAtDepth<1>

/** Minimal document shape returned by metadata-only queries */
export type MetaDoc = {
  id?: number | string
  title?: string
  slug?: string
  heroImage?: Media | number | null
  description?: Hotel['description'] | null
  meta?: {
    title?: string | null
    image?: Media | number | null
    description?: string | null
  }
  breadcrumbs?: Page['breadcrumbs']
}
