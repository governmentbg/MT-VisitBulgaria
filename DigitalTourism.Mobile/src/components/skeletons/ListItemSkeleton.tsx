import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {moderateScale} from '../../theme/scaling';

export function ListItemSkeleton() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" gap={moderateScale(12)} padding={moderateScale(8)}>
        <SkeletonPlaceholder.Item width={moderateScale(74)} height={moderateScale(74)} borderRadius={moderateScale(12)} />
        <SkeletonPlaceholder.Item gap={moderateScale(8)} flex={1}>
          <SkeletonPlaceholder.Item width={moderateScale(180)} height={moderateScale(16)} borderRadius={4} />
          <SkeletonPlaceholder.Item width={moderateScale(120)} height={moderateScale(12)} borderRadius={4} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
}
