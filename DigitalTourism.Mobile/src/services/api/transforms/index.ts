/**
 * Transformation Layer Barrel Export
 * 
 * Central export point for all Payload CMS to App model transformers.
 * Import transformation functions from this module for consistent usage
 * across the application.
 * 
 * @module api/transforms
 */

// Attraction transformers
export {
  transformPayloadAttractionToApp,
  transformPayloadAttractionsToApp,
} from './attractionTransform';

// Event transformers
export {
  transformPayloadEventToApp,
  transformPayloadEventsToApp,
} from './eventTransform';

// Hotel transformers
export {
  transformPayloadHotelToApp,
  transformPayloadHotelsToApp,
} from './hotelTransform';

// Restaurant transformers
export {
  transformPayloadRestaurantToApp,
  transformPayloadRestaurantsToApp,
} from './restaurantTransform';

// Activity transformers
export {
  transformPayloadActivityToApp,
  transformPayloadActivitiesToApp,
} from './activityTransform';

// Route (Trip) transformers
export {
  transformPayloadTripToApp,
  transformPayloadTripsToApp,
} from './routeTransform';

// Pagination utilities
export {
  extractPaginationMeta,
  transformPaginatedResponseSync,
  type PaginationMeta,
} from './paginationTransform';

// Search / Map transformers
export {
  hitToMapMarker,
  hitsToMapMarkers,
  type MapMarker,
} from './searchTransform';
