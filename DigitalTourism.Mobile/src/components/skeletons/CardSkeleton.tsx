import React from 'react';
import {Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {moderateScale} from '../../theme/scaling';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - moderateScale(32);

export function CardSkeleton() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item marginHorizontal={moderateScale(16)} marginBottom={moderateScale(16)}>
        <SkeletonPlaceholder.Item width={CARD_WIDTH} height={moderateScale(200)} borderRadius={moderateScale(16)} />
        <SkeletonPlaceholder.Item padding={moderateScale(12)} gap={moderateScale(8)}>
          <SkeletonPlaceholder.Item width={moderateScale(80)} height={moderateScale(12)} borderRadius={4} />
          <SkeletonPlaceholder.Item width={moderateScale(200)} height={moderateScale(18)} borderRadius={4} />
          <SkeletonPlaceholder.Item width={CARD_WIDTH - moderateScale(24)} height={moderateScale(14)} borderRadius={4} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
}
