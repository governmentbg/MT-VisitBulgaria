import React from 'react';
import {Box, type IconName} from '../../../design';
import {CommonInfoPills, DetailInfoPill, EventCountdown} from '..';
import {createDetailContent} from './createDetailContent';
import {EventStatus} from '../../../models/Event';
import type {Event} from '../../../models/Event';
import {formatLongDate} from '../../../utils/formatters';

const statusConfig: Record<EventStatus, {label: string; icon: IconName}> = {
  [EventStatus.UPCOMING]: {label: 'Upcoming', icon: 'calendar-clock'},
  [EventStatus.ACTIVE]: {label: 'Active now', icon: 'check-circle-outline'},
  [EventStatus.PAST]: {label: 'Past', icon: 'calendar-remove'},
};

export const EventDetailContent = createDetailContent<Event>(
  'EventDetailContent',
  {
    i18nNamespace: 'events',
    emoji: '',
    nearbyCardStyle: 'flat',
    contactLabelPreset: 'minimal',
    renderContent: (event, {t, renderActions, renderAbout}) => {
      const dateText = formatLongDate(event.period.startDate);

      return (
        <>
          {event.status && (
            <Box marginTop="s">
              <DetailInfoPill
                icon={statusConfig[event.status].icon}
                text={t(`status.${event.status}`, {
                  defaultValue: statusConfig[event.status].label,
                })}
              />
            </Box>
          )}

          <EventCountdown
            targetDate={event.period.startDate}
            status={event.status}
          />

          <Box marginTop="m" gap="xs">
            {dateText ? (
              <DetailInfoPill icon="calendar-outline" text={dateText} />
            ) : null}
            <CommonInfoPills entity={event} />
          </Box>

          {renderAbout()}

          {event.ticketPrice !== undefined && event.ticketPrice > 0 && (
            <Box marginTop="m" gap="xs">
              <DetailInfoPill
                icon="ticket-outline"
                text={`${event.ticketPrice} BGN`}
              />
            </Box>
          )}

          {event.organizer ? (
            <Box marginTop="m" gap="xs">
              <DetailInfoPill icon="account-outline" text={event.organizer} />
            </Box>
          ) : null}

          {renderActions()}
        </>
      );
    },
  },
);
