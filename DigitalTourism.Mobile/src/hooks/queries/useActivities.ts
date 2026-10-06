import {createEntityHooks} from './createEntityHooks';
import {queryKeys} from '../../utils/queryKeys';
import {activitiesApi} from '../../services/api';
import type {Activity} from '../../models/Activity';

const {useAll, useOne} = createEntityHooks<Activity>({
  queryKeyNamespace: queryKeys.activities,
  api: activitiesApi,
});

export const useActivities = useAll;
export const useActivity = useOne;
