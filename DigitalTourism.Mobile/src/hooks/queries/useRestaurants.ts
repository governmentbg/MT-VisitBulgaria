import {createEntityHooks} from './createEntityHooks';
import {queryKeys} from '../../utils/queryKeys';
import {restaurantsApi} from '../../services/api';
import type {Restaurant} from '../../models/Restaurant';

const {useAll, useOne} = createEntityHooks<Restaurant>({
  queryKeyNamespace: queryKeys.restaurants,
  api: restaurantsApi,
});

export const useRestaurants = useAll;
export const useRestaurant = useOne;
