/**
 * createDetailContent
 *
 * Factory that eliminates boilerplate in entity detail content components.
 * Each entity only provides its config + renderContent with entity-specific JSX.
 */

import React from 'react';
import {
  DetailContentBase,
  type DetailContentProps,
  type ContentHelpers,
  type ContactLabelPreset,
} from './DetailContentBase';
import type {BaseEntity} from '../../../models/BaseEntity';

interface DetailContentConfig<E extends BaseEntity> {
  i18nNamespace: string;
  emoji: string;
  nearbyCardStyle?: 'flat' | 'elevated';
  contactLabelPreset?: ContactLabelPreset;
  getSubtitle?: (entity: E) => string | undefined;
  renderContent: (entity: E, helpers: ContentHelpers) => React.ReactNode;
}

export function createDetailContent<E extends BaseEntity>(
  displayName: string,
  config: DetailContentConfig<E>,
) {
  const Component = React.memo(function (props: DetailContentProps<E>) {
    const subtitle = config.getSubtitle?.(props.entity);
    return (
      <DetailContentBase
        entity={props.entity}
        similarItems={props.similarItems}
        nearbyItems={props.nearbyItems}
        onNavigateToDetail={props.onNavigateToDetail}
        onPushNearby={props.onPushNearby}
        i18nNamespace={config.i18nNamespace}
        emoji={config.emoji}
        nearbyCardStyle={config.nearbyCardStyle}
        contactLabelPreset={config.contactLabelPreset}
        subtitle={subtitle}>
        {helpers => config.renderContent(props.entity, helpers)}
      </DetailContentBase>
    );
  });
  Component.displayName = displayName;
  return Component;
}
