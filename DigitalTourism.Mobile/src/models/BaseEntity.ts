import type {Location} from './Location';
import type {Category} from './Category';
import type {LexicalRoot} from '../services/api/types/lexical';

/**
 * Fields shared by all 5 entity types (Attraction, Event, Hotel, Restaurant, Activity).
 * Entity-specific interfaces extend this with additional fields.
 */
export interface BaseEntity {
  id: string;
  slug?: string;
  name: string;
  description: LexicalRoot | null;
  location: Location;
  category: Category;
  cityId?: string;
  images: string[];
  videos: Array<{url: string; title?: string}>;
  address?: string;
  phone?: string;
  website?: string;
  brochures: Array<{url: string; title: string; filesize?: number}>;
  relatedExperiences: Array<{
    id: string;
    name: string;
    type: string;
    imageUrl?: string;
  }>;
  cityName?: string;
  municipalityName?: string;
  howToGetThere?: LexicalRoot | null;
  practicalInfo?: LexicalRoot | null;
  infoCenter?: LexicalRoot | null;
  contactInfo?: LexicalRoot | null;
}
