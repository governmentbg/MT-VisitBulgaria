import React from 'react';
import {Box} from '../../../design';
import {CommonInfoPills, DetailInfoPill, StarRatingDisplay, PillList} from '..';
import {createDetailContent} from './createDetailContent';
import type {Hotel} from '../../../models/Hotel';

export const HotelDetailContent = createDetailContent<Hotel>('HotelDetailContent', {
  i18nNamespace: 'hotels',
  emoji: '🏨',
  nearbyCardStyle: 'elevated',
  contactLabelPreset: 'standard',
  renderContent: (hotel, {t, renderActions, renderAbout}) => (
    <>
      {hotel.starRating != null && hotel.starRating > 0 && (
        <StarRatingDisplay rating={hotel.starRating} />
      )}

      <Box marginTop="m" gap="xs">
        <CommonInfoPills entity={hotel} />
        {hotel.checkInTime && (
          <DetailInfoPill
            icon="login"
            text={`${t('checkIn', {defaultValue: 'Check-in'})}: ${hotel.checkInTime}`}
          />
        )}
        {hotel.checkOutTime && (
          <DetailInfoPill
            icon="logout"
            text={`${t('checkOut', {defaultValue: 'Check-out'})}: ${hotel.checkOutTime}`}
          />
        )}
      </Box>

      {hotel.amenities && hotel.amenities.length > 0 && (
        <Box marginTop="m">
          <PillList items={hotel.amenities} defaultIcon="check" />
        </Box>
      )}

      {renderActions()}
      {renderAbout()}
    </>
  ),
});
