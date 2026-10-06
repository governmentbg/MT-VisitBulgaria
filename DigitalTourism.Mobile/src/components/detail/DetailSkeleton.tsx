import React from 'react';
import {Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {moderateScale} from '../../theme/scaling';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export function DetailSkeleton() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item>
        {/* Hero image placeholder */}
        <SkeletonPlaceholder.Item
          width={SCREEN_WIDTH}
          height={SCREEN_WIDTH}
        />

        {/* Content area */}
        <SkeletonPlaceholder.Item padding={moderateScale(16)} gap={moderateScale(12)}>
          {/* Category label */}
          <SkeletonPlaceholder.Item width={moderateScale(100)} height={moderateScale(14)} borderRadius={4} />

          {/* Title */}
          <SkeletonPlaceholder.Item width={moderateScale(250)} height={moderateScale(24)} borderRadius={4} />

          {/* Location */}
          <SkeletonPlaceholder.Item width={moderateScale(180)} height={moderateScale(13)} borderRadius={4} />

          {/* Info pills */}
          <SkeletonPlaceholder.Item marginTop={moderateScale(8)} gap={moderateScale(8)}>
            <SkeletonPlaceholder.Item
              width={SCREEN_WIDTH - moderateScale(32)}
              height={moderateScale(40)}
              borderRadius={100}
            />
            <SkeletonPlaceholder.Item
              width={SCREEN_WIDTH - moderateScale(32)}
              height={moderateScale(40)}
              borderRadius={100}
            />
          </SkeletonPlaceholder.Item>

          {/* About section */}
          <SkeletonPlaceholder.Item marginTop={moderateScale(16)} gap={moderateScale(8)}>
            <SkeletonPlaceholder.Item width={moderateScale(60)} height={moderateScale(16)} borderRadius={4} />
            <SkeletonPlaceholder.Item width={SCREEN_WIDTH - moderateScale(32)} height={moderateScale(14)} borderRadius={4} />
            <SkeletonPlaceholder.Item width={SCREEN_WIDTH - moderateScale(64)} height={moderateScale(14)} borderRadius={4} />
            <SkeletonPlaceholder.Item width={SCREEN_WIDTH - moderateScale(48)} height={moderateScale(14)} borderRadius={4} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
}
