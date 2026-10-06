import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';

interface StarRatingDisplayProps {
  rating: number; // 1-5
}

const STAR_COLOR = palette.warning;
const STAR_SIZE = moderateScale(20);
const TOTAL_STARS = 5;

export const StarRatingDisplay = React.memo(function StarRatingDisplay({
  rating,
}: StarRatingDisplayProps) {
  const {t} = useTranslation('common');
  const clampedRating = Math.min(Math.max(Math.round(rating), 0), TOTAL_STARS);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={t('a11y.starRating', {rating: clampedRating, total: TOTAL_STARS})}
      accessibilityRole="text">
      {Array.from({length: TOTAL_STARS}, (_, i) => (
        <Icon
          key={i}
          source={i < clampedRating ? 'star' : 'star-outline'}
          size={STAR_SIZE}
          color={STAR_COLOR}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(2),
  },
});
