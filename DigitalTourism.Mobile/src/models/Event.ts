import type {BaseEntity} from './BaseEntity';
import type {WorkingHoursEntry} from '../types/common';

export interface EventPeriod {
  startDate: string;
  endDate: string;
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  PAST = 'past',
}

export interface Event extends BaseEntity {
  period: EventPeriod;
  status: EventStatus;
  ticketPrice?: number;
  organizer?: string;
  workingHours?: WorkingHoursEntry[];
}
