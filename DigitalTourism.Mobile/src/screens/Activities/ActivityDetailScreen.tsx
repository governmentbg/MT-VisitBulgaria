import {createDetailScreen} from '../shared/createDetailScreen';
import {useActivity, useActivities} from '../../hooks/queries/useActivities';
import {ActivityDetailContent} from '../../components/detail/content/ActivityDetailContent';
import type {Activity} from '../../models/Activity';

export const ActivityDetailScreen = createDetailScreen<Activity>({
  relationTo: 'activities',
  i18nNamespace: 'activities',
  analyticsType: 'activity',
  detailRoute: 'ActivityDetail',
  useEntity: useActivity,
  useAllEntities: useActivities,
  ContentComponent: ActivityDetailContent,
});
