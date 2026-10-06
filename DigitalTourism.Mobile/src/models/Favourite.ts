/**
 * Favourite model — mirrors the Payload CMS `favorites` collection.
 *
 * A favourite links a visitor to a polymorphic experience (hotel, restaurant,
 * activity, attraction, or event).
 */

export type FavouriteExperienceType =
  | 'hotels'
  | 'restaurants'
  | 'activities'
  | 'attractions'
  | 'events';

export interface FavouriteExperience {
  relationTo: FavouriteExperienceType;
  value: number | PopulatedExperience;
}

/**
 * Populated experience fields returned when depth >= 2.
 * Matches the shape the website's favourites page expects.
 */
export interface PopulatedExperience {
  id: number;
  title: string;
  slug: string;
  heroImage?: {
    url?: string;
    alt?: string;
    sizes?: {
      medium?: { url?: string };
      thumbnail?: { url?: string };
    };
  };
  city?: { name?: string } | number;
  categories?: Array<{ title?: string } | number>;
  location?: {
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  starRating?: number;
  period?: {
    startDate?: string;
    endDate?: string;
  };
}

export interface Favourite {
  id: number;
  visitor: number;
  experience: FavouriteExperience;
  createdAt: string;
  updatedAt: string;
}

/**
 * Normalised favourite item used by the UI layer.
 * Flattened from the polymorphic Payload response.
 */
export interface FavouriteItem {
  /** Composite key: `{relationTo}_{numericId}` */
  id: string;
  /** Payload favourite document ID (needed for DELETE) */
  favouriteId: number;
  title: string;
  type: FavouriteExperienceType;
  imageUrl: string;
  imageAlt: string;
  cityName?: string;
  categories?: string[];
  starRating?: number;
  startDate?: string;
  endDate?: string;
  latitude?: number;
  longitude?: number;
}
