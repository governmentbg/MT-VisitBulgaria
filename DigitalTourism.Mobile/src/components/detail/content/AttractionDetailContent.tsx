import React from 'react';
import {Box} from '../../../design';
import {CommonInfoPills, DetailInfoPill} from '..';
import {AudioGuideSelector} from '../../audio';
import {createDetailContent} from './createDetailContent';
import type {Attraction} from '../../../models/Attraction';
import {extractPlainText} from '../../../services/api/transforms/payloadHelpers';

export const AttractionDetailContent = createDetailContent<Attraction>(
  'AttractionDetailContent',
  {
    i18nNamespace: 'attractions',
    emoji: '\uD83C\uDFDB\uFE0F',
    nearbyCardStyle: 'flat',
    contactLabelPreset: 'minimal',
    renderContent: (attraction, {t, tCommon, renderActions, renderAbout}) => (
      <>
        <Box marginTop="m" gap="xs">
          <CommonInfoPills entity={attraction} showPhone showWebsite />
          {attraction.visitDuration != null && attraction.visitDuration > 0 && (
            <DetailInfoPill
              icon="timer-outline"
              text={`${t('visitDuration', {defaultValue: 'Visit duration'})}: ${attraction.visitDuration} ${tCommon('minutes', {defaultValue: 'min'})}`}
            />
          )}
          {(() => {
            const openingHoursText = extractPlainText(attraction.openingHours);
            return openingHoursText ? (
              <DetailInfoPill icon="clock-outline" text={openingHoursText} />
            ) : null;
          })()}
          {attraction.ticketPrice != null && attraction.ticketPrice > 0 && (
            <DetailInfoPill
              icon="ticket-outline"
              text={`${attraction.ticketPrice} BGN`}
            />
          )}
        </Box>

        {renderActions()}
        {renderAbout()}

        {(attraction.audioGuides || attraction.audioGuide) && (
          <Box marginTop="l">
            <AudioGuideSelector attraction={attraction} />
          </Box>
        )}
      </>
    ),
  },
);
