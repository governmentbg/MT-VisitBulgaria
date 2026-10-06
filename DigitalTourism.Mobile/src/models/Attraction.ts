import type {BaseEntity} from './BaseEntity';
import type {AudioGuide, AudioGuideSection} from './AudioGuide';
import type {LexicalRoot} from '../services/api/types/lexical';

export interface Attraction extends BaseEntity {
  audioGuide?: AudioGuide;
  audioGuides?: AudioGuideSection[];
  rating: number;
  visitDuration: number;
  openingHours?: LexicalRoot | null;
  ticketPrice?: number;
}
