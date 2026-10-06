import {createEntityHooks} from './createEntityHooks';
import {queryKeys} from '../../utils/queryKeys';
import {hotelsApi} from '../../services/api';
import type {Hotel} from '../../models/Hotel';

const {useAll, useOne} = createEntityHooks<Hotel>({
  queryKeyNamespace: queryKeys.hotels,
  api: hotelsApi,
});

export const useHotels = useAll;
export const useHotel = useOne;
