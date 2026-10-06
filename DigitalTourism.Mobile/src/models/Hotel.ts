import type {BaseEntity} from './BaseEntity';
import type {TagItem, WorkingHoursEntry} from '../types/common';

export interface Hotel extends BaseEntity {
  email?: string;
  starRating: number;
  rooms?: number;
  amenities: TagItem[];
  checkInTime?: string;
  checkOutTime?: string;
  workingHours?: WorkingHoursEntry[];
  bookingUrl?: string;
}
