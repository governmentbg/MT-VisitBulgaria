import React from 'react';
import {Box} from '../../../design';
import {CommonInfoPills, ExpandableWorkingHours, PillList} from '..';
import {createDetailContent} from './createDetailContent';
import type {Restaurant} from '../../../models/Restaurant';

export const RestaurantDetailContent = createDetailContent<Restaurant>(
  'RestaurantDetailContent',
  {
    i18nNamespace: 'restaurants',
    emoji: '\uD83C\uDF7D\uFE0F',
    nearbyCardStyle: 'elevated',
    contactLabelPreset: 'restaurant',
    getSubtitle: restaurant =>
      restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0
        ? restaurant.cuisineTypes.map(c => c.name).join(' \u2022 ')
        : undefined,
    renderContent: (restaurant, {renderActions, renderAbout}) => (
      <>
        {restaurant.workingHours &&
          Array.isArray(restaurant.workingHours) &&
          restaurant.workingHours.length > 0 && (
            <Box marginTop="s">
              <ExpandableWorkingHours hours={restaurant.workingHours} />
            </Box>
          )}

        <Box marginTop="m" gap="xs">
          <CommonInfoPills entity={restaurant} showPhone showWebsite />
        </Box>

        {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
          <Box marginTop="m">
            <PillList items={restaurant.dietaryOptions} defaultIcon="leaf" />
          </Box>
        )}

        {renderActions()}
        {renderAbout()}
      </>
    ),
  },
);
