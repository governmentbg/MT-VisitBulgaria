import {createDetailScreen} from '../shared/createDetailScreen';
import {useAttraction, useAttractions} from '../../hooks/queries/useAttractions';
import {AttractionDetailContent} from '../../components/detail/content/AttractionDetailContent';
import type {Attraction} from '../../models/Attraction';

export const AttractionDetailScreen = createDetailScreen<Attraction>({
  relationTo: 'attractions',
  i18nNamespace: 'attractions',
  analyticsType: 'attraction',
  detailRoute: 'AttractionDetail',
  useEntity: useAttraction,
  useAllEntities: useAttractions,
  ContentComponent: AttractionDetailContent,
});
