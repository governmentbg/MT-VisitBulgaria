import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/types';

const SCREEN_MAP: Record<string, keyof RootStackParamList> = {
  event: 'EventDetail',
  events: 'EventDetail',
  hotel: 'HotelDetail',
  hotels: 'HotelDetail',
  restaurant: 'RestaurantDetail',
  restaurants: 'RestaurantDetail',
  activity: 'ActivityDetail',
  activities: 'ActivityDetail',
  attraction: 'AttractionDetail',
  attractions: 'AttractionDetail',
};

/**
 * Navigate to the appropriate detail screen based on experience type.
 * Handles both singular (Typesense) and plural (Payload CMS) type values.
 */
export function navigateToDetail(
  navigation: NativeStackNavigationProp<RootStackParamList>,
  type: string,
  id: string,
) {
  const screen = SCREEN_MAP[type] ?? 'AttractionDetail';
  // All detail screens accept {id} params; dynamic screen name requires type widening
  (navigation.navigate as (screen: string, params: {id: string}) => void)(screen, {id});
}

/**
 * Push a detail screen onto the stack. Same as navigateToDetail but always creates
 * a new screen instance — used when drilling from one detail into another (e.g., nearby).
 */
export function pushDetail(
  navigation: NativeStackNavigationProp<RootStackParamList>,
  type: string,
  id: string,
) {
  const screen = SCREEN_MAP[type] ?? 'AttractionDetail';
  (navigation.push as (screen: string, params: {id: string}) => void)(screen, {id});
}
