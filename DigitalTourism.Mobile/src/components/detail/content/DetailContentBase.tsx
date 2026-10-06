/**
 * DetailContentBase
 *
 * Shared base for all entity detail content components.
 * Handles: SharedDetailSections wrapper, DetailCategoryTitle, contact actions,
 * and about section — via render-prop helpers so each entity controls ordering.
 */

import React from 'react';
import {Linking} from 'react-native';
import {Box} from '../../../design';
import {useTranslation} from 'react-i18next';
import type {TFunction} from 'i18next';
import {
  DetailCategoryTitle,
  DetailAboutSection,
  DetailActionButtons,
} from '..';
import {SharedDetailSections} from './SharedDetailSections';
import type {BaseEntity} from '../../../models/BaseEntity';
import type {DetailNearbyItem} from '../DetailNearbyCard';
import {formatLocation, buildContactActions} from '../../../utils/formatters';

/** Shared props interface for all entity detail content components */
export interface DetailContentProps<E extends BaseEntity> {
  entity: E;
  similarItems?: DetailNearbyItem[];
  nearbyItems?: DetailNearbyItem[];
  onNavigateToDetail?: (type: string, id: string) => void;
  onPushNearby?: (id: string, type?: string) => void;
}

export interface ContentHelpers {
  t: TFunction;
  tCommon: TFunction;
  /** Renders contact action buttons (call, website, reserve, etc.) */
  renderActions: () => React.ReactNode;
  /** Renders the entity description "About" section */
  renderAbout: (titleOverride?: string) => React.ReactNode;
}

export type ContactLabelPreset = 'standard' | 'minimal' | 'restaurant';

function resolveContactLabels(
  preset: ContactLabelPreset,
  t: TFunction,
  tCommon: TFunction,
): Record<string, string> {
  const base = {
    call: preset === 'minimal'
      ? tCommon('fields.contact', {defaultValue: 'Call'})
      : t('call', {defaultValue: 'Call'}),
    website: tCommon('fields.website', {defaultValue: 'Web'}),
  };

  if (preset === 'minimal') return base;

  const withReserve = {
    ...base,
    reserve: t('makeReservation', {defaultValue: 'Reserve'}),
  };

  if (preset === 'restaurant') {
    return {...withReserve, menu: t('viewMenu', {defaultValue: 'Menu'})};
  }

  return withReserve;
}

interface DetailContentBaseProps<E extends BaseEntity> {
  entity: E;
  similarItems?: DetailNearbyItem[];
  nearbyItems?: DetailNearbyItem[];
  onNavigateToDetail?: (type: string, id: string) => void;
  onPushNearby?: (id: string, type?: string) => void;
  /** i18n namespace for entity-specific translations */
  i18nNamespace: string;
  /** Emoji shown in the category title */
  emoji: string;
  /** Nearby card display style */
  nearbyCardStyle?: 'flat' | 'elevated';
  /** Optional subtitle under the entity name */
  subtitle?: string;
  /** Contact label preset — use instead of getContactLabels for standard patterns */
  contactLabelPreset?: ContactLabelPreset;
  /** Custom contact label builder — overrides contactLabelPreset when provided */
  getContactLabels?: (t: TFunction, tCommon: TFunction) => Record<string, string>;
  /** Entity-specific content — controls ordering via render helpers */
  children: (helpers: ContentHelpers) => React.ReactNode;
}

function DetailContentBaseInner<E extends BaseEntity>({
  entity,
  similarItems = [],
  nearbyItems = [],
  onNavigateToDetail,
  onPushNearby,
  i18nNamespace,
  emoji,
  nearbyCardStyle = 'flat',
  subtitle,
  contactLabelPreset,
  getContactLabels,
  children,
}: DetailContentBaseProps<E>) {
  const {t} = useTranslation(i18nNamespace);
  const {t: tCommon} = useTranslation('common');

  const typeLabel = t('title', {defaultValue: i18nNamespace});

  const labels = getContactLabels
    ? getContactLabels(t, tCommon)
    : resolveContactLabels(contactLabelPreset ?? 'standard', t, tCommon);
  const actions = buildContactActions(entity, labels);

  const renderActions = () =>
    actions.length > 0 ? (
      <Box marginTop="m">
        <DetailActionButtons
          actions={actions.map(a => ({
            ...a,
            onPress: () => Linking.openURL(a.url),
          }))}
        />
      </Box>
    ) : null;

  const renderAbout = (titleOverride?: string) => (
    <DetailAboutSection
      title={titleOverride || t('about', {defaultValue: 'About'})}
      content={entity.description}
    />
  );

  return (
    <SharedDetailSections
      entity={entity}
      similarItems={similarItems}
      nearbyItems={nearbyItems}
      nearbyCategoryLabel={typeLabel}
      nearbyCardStyle={nearbyCardStyle}
      onNavigateToDetail={onNavigateToDetail}
      onPushNearby={onPushNearby}>
      <DetailCategoryTitle
        emoji={emoji}
        categoryName={typeLabel}
        name={entity.name}
        subtitle={subtitle}
        location={formatLocation(entity.cityName, entity.municipalityName)}
      />

      {children({t, tCommon, renderActions, renderAbout})}
    </SharedDetailSections>
  );
}

export const DetailContentBase = React.memo(
  DetailContentBaseInner,
) as typeof DetailContentBaseInner;
