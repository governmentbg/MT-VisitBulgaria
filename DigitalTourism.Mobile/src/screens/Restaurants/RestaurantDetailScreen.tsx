import {createDetailScreen} from '../shared/createDetailScreen';
import {useRestaurant, useRestaurants} from '../../hooks/queries/useRestaurants';
import {RestaurantDetailContent} from '../../components/detail/content/RestaurantDetailContent';
import type {Restaurant} from '../../models/Restaurant';

export const RestaurantDetailScreen = createDetailScreen<Restaurant>({
  relationTo: 'restaurants',
  i18nNamespace: 'restaurants',
  analyticsType: 'restaurant',
  detailRoute: 'RestaurantDetail',
  useEntity: useRestaurant,
  useAllEntities: useRestaurants,
  ContentComponent: RestaurantDetailContent,
});
