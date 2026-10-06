import type {BaseEntity} from './BaseEntity';
import type {TagItem, WorkingHoursEntry} from '../types/common';

export interface Restaurant extends BaseEntity {
  subtitle?: string;
  email?: string;
  cuisineTypes: TagItem[];
  dietaryOptions: TagItem[];
  priceRange?: string;
  workingHours?: WorkingHoursEntry[];
  menuUrl?: string;
  reservationUrl?: string;
  bookingUrl?: string;
}
