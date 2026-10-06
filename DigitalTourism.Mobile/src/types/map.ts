/** Unified map item type — used across map components, search results, and Typesense transforms. */
export interface MapItem {
  id: string;
  name: string;
  description: string;
  location: {latitude: number; longitude: number};
  category: {id: string; name: string; type: string; icon: string; color: string};
  images: string[];
  __source: string;
  distanceMeters?: number;
  cityId?: string;
  cityName?: string;
}
