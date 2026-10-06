import React from 'react';
import {Linking} from 'react-native';
import {DetailInfoPill} from './DetailInfoPill';
import type {BaseEntity} from '../../models/BaseEntity';

interface CommonInfoPillsProps {
  entity: Pick<BaseEntity, 'address' | 'phone' | 'website'>;
  /** Show phone pill with tel: link (default: false) */
  showPhone?: boolean;
  /** Show website pill with link (default: false) */
  showWebsite?: boolean;
}

export const CommonInfoPills = React.memo(function CommonInfoPills({
  entity,
  showPhone = false,
  showWebsite = false,
}: CommonInfoPillsProps) {
  return (
    <>
      {entity.address && (
        <DetailInfoPill icon="map-marker-outline" text={entity.address} />
      )}
      {showPhone && entity.phone && (
        <DetailInfoPill
          icon="phone-outline"
          text={entity.phone}
          onPress={() => Linking.openURL(`tel:${entity.phone}`).catch(err => { if (__DEV__) console.warn('[CommonInfoPills] Failed to open phone URL:', err); })}
        />
      )}
      {showWebsite && entity.website && (
        <DetailInfoPill
          icon="web"
          text={entity.website.replace(/^https?:\/\//, '')}
          onPress={() => Linking.openURL(entity.website!).catch(err => { if (__DEV__) console.warn('[CommonInfoPills] Failed to open website URL:', err); })}
        />
      )}
    </>
  );
});
