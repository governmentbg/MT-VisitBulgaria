/**
 * Shared Detail Sections
 *
 * Renders the common tail sections shared by all 5 detail content components:
 * videos, brochures, related, howToGetThere, practicalInfo, infoCenter,
 * contactInfo, divider, and nearby.
 *
 * Entity-specific head content is rendered via children (before these sections).
 */

import React from 'react';
import {Box} from '../../../design';
import {useTranslation} from 'react-i18next';
import {
  DetailAboutSection,
  DetailDivider,
  DetailNearbyTabs,
  DetailVideoSection,
  DetailBrochuresSection,
  DetailRelatedSection,
} from '..';
import type {BaseEntity} from '../../../models/BaseEntity';
import type {DetailNearbyItem} from '../DetailNearbyCard';

interface SharedDetailSectionsProps {
  entity: BaseEntity;
  similarItems?: DetailNearbyItem[];
  nearbyItems?: DetailNearbyItem[];
  nearbyCategoryLabel?: string;
  nearbyCardStyle?: 'flat' | 'elevated';
  onNavigateToDetail?: (type: string, id: string) => void;
  onPushNearby?: (id: string, type?: string) => void;
  /** Entity-specific content rendered BEFORE the shared sections */
  children?: React.ReactNode;
}

export function SharedDetailSections({
  entity,
  similarItems = [],
  nearbyItems = [],
  nearbyCategoryLabel,
  nearbyCardStyle = 'flat',
  onNavigateToDetail,
  onPushNearby,
  children,
}: SharedDetailSectionsProps) {
  const {t: tCommon} = useTranslation('common');

  return (
    <>
      {children}

      {entity.videos && entity.videos.length > 0 && (
        <Box marginTop="l">
          <DetailVideoSection videos={entity.videos} />
        </Box>
      )}

      {entity.brochures && entity.brochures.length > 0 && (
        <DetailBrochuresSection
          title={tCommon('brochures', {defaultValue: 'Brochures'})}
          brochures={entity.brochures}
        />
      )}

      {entity.relatedExperiences &&
        entity.relatedExperiences.length > 0 && (
          <DetailRelatedSection
            title={tCommon('related', {defaultValue: 'Related'})}
            items={entity.relatedExperiences}
            onItemPress={(type, itemId) =>
              onNavigateToDetail?.(type, itemId)
            }
          />
        )}

      <DetailAboutSection
        title={tCommon('howToGetThere', {defaultValue: 'How to get there'})}
        content={entity.howToGetThere}
      />
      <DetailAboutSection
        title={tCommon('practicalInfo', {
          defaultValue: 'Practical information',
        })}
        content={entity.practicalInfo}
      />
      <DetailAboutSection
        title={tCommon('infoCenter', {defaultValue: 'Info center'})}
        content={entity.infoCenter}
      />
      <DetailAboutSection
        title={tCommon('contactInfo', {defaultValue: 'Contact info'})}
        content={entity.contactInfo}
      />


      {(similarItems.length > 0 || nearbyItems.length > 0) && (
        <>
          <DetailDivider />
          <DetailNearbyTabs
            similarItems={similarItems}
            nearbyItems={nearbyItems}
            categoryLabel={nearbyCategoryLabel}
            cardStyle={nearbyCardStyle}
            onItemPress={(itemId, itemType) => onPushNearby?.(itemId, itemType)}
          />
        </>
      )}
    </>
  );
}
