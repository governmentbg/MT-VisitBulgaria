import {createDetailScreen} from '../shared/createDetailScreen';
import {useEvent, useActiveEvents} from '../../hooks/queries/useEvents';
import {EventDetailContent} from '../../components/detail/content/EventDetailContent';
import type {Event} from '../../models/Event';

export const EventDetailScreen = createDetailScreen<Event>({
  relationTo: 'events',
  i18nNamespace: 'events',
  analyticsType: 'event',
  detailRoute: 'EventDetail',
  useEntity: useEvent,
  useAllEntities: useActiveEvents,
  ContentComponent: EventDetailContent,
});
