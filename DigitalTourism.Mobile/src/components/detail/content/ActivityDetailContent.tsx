import React from 'react';
import {Box} from '../../../design';
import {CommonInfoPills, DetailInfoPill, PillList} from '..';
import {createDetailContent} from './createDetailContent';
import type {Activity} from '../../../models/Activity';

export const ActivityDetailContent = createDetailContent<Activity>(
  'ActivityDetailContent',
  {
    i18nNamespace: 'activities',
    emoji: '\uD83C\uDFD4\uFE0F',
    nearbyCardStyle: 'elevated',
    contactLabelPreset: 'standard',
    renderContent: (activity, {t, renderActions, renderAbout}) => (
      <>
        <Box marginTop="m" gap="xs">
          <CommonInfoPills entity={activity} />
          {activity.duration && (
            <DetailInfoPill icon="clock-outline" text={activity.duration} />
          )}
          {activity.difficultyLevel && (
            <DetailInfoPill
              icon="signal"
              text={`${t('difficulty', {defaultValue: 'Difficulty'})}: ${activity.difficultyLevel.name}`}
            />
          )}
          {activity.minimumAge != null && (
            <DetailInfoPill
              icon="account-child"
              text={`${t('minimumAge', {defaultValue: 'Min. age'})}: ${activity.minimumAge}`}
            />
          )}
          {activity.groupSize && (
            <DetailInfoPill
              icon="account-group"
              text={`${t('groupSize', {defaultValue: 'Group'})}: ${activity.groupSize.min}-${activity.groupSize.max}`}
            />
          )}
          {activity.equipmentProvided != null && (
            <DetailInfoPill
              icon={
                activity.equipmentProvided
                  ? 'check-circle-outline'
                  : 'close-circle-outline'
              }
              text={
                activity.equipmentProvided
                  ? t('equipmentProvided', {defaultValue: 'Equipment provided'})
                  : t('equipmentNotProvided', {
                      defaultValue: 'Bring your own equipment',
                    })
              }
            />
          )}
        </Box>

        {activity.seasonality && activity.seasonality.length > 0 && (
          <Box marginTop="m">
            <PillList
              items={activity.seasonality.map(s => ({
                id: s.id,
                name: s.name,
                icon: 'weather-sunny',
              }))}
            />
          </Box>
        )}

        {renderActions()}
        {renderAbout()}
      </>
    ),
  },
);
