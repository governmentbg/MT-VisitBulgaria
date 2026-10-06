import type {BaseEntity} from './BaseEntity';
import type {TagItem, WorkingHoursEntry} from '../types/common';

export interface ActivityGroupSize {
  min: number;
  max: number;
}

export interface Activity extends BaseEntity {
  email?: string;
  duration?: string;
  difficultyLevel?: TagItem;
  seasonality: TagItem[];
  minimumAge?: number;
  groupSize?: ActivityGroupSize;
  equipmentProvided?: boolean;
  whatToBring?: string;
  includes: Array<{label: string}>;
  workingHours?: WorkingHoursEntry[];
  bookingUrl?: string;
}
