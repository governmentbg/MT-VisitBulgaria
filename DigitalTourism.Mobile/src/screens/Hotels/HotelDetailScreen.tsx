import {createDetailScreen} from '../shared/createDetailScreen';
import {useHotel, useHotels} from '../../hooks/queries/useHotels';
import {HotelDetailContent} from '../../components/detail/content/HotelDetailContent';
import type {Hotel} from '../../models/Hotel';

export const HotelDetailScreen = createDetailScreen<Hotel>({
  relationTo: 'hotels',
  i18nNamespace: 'hotels',
  analyticsType: 'hotel',
  detailRoute: 'HotelDetail',
  useEntity: useHotel,
  useAllEntities: useHotels,
  ContentComponent: HotelDetailContent,
});
