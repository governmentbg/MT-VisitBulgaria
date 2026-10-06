import {Location} from './Location';

export interface City {
  id: string;
  name: string;
  coordinates: Location;
  heroImageUrl?: string;
  population?: number;
}
