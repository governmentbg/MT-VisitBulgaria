import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Box, Icon, Image, Text, ResizeMode} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {formatDistance} from '../../utils/mapHelpers';

export interface DetailNearbyItem {
  id: string;
  name: string;
  images: string[];
  /** Experience type — 'attraction' | 'event' | 'hotel' | 'restaurant' | 'activity'.
   *  Used to resolve the per-item type label and route to the correct detail screen. */
  type?: string;
  category?: {name: string};
  distanceMeters?: number;
}

interface DetailNearbyCardProps {
  item: DetailNearbyItem;
  /** Overrides per-item category display — used when the list is single-type (Similar tab). */
  categoryLabel?: string;
  onPress: () => void;
  cardStyle?: 'flat' | 'elevated';
}

const TYPE_NS: Record<string, string> = {
  attraction: 'attractions',
  attractions: 'attractions',
  event: 'events',
  events: 'events',
  hotel: 'hotels',
  hotels: 'hotels',
  restaurant: 'restaurants',
  restaurants: 'restaurants',
  activity: 'activities',
  activities: 'activities',
};

export const DetailNearbyCard = React.memo(function DetailNearbyCard({
  item,
  categoryLabel,
  onPress,
  cardStyle = 'flat',
}: DetailNearbyCardProps) {
  const {t} = useTranslation([
    'common',
    'attractions',
    'events',
    'hotels',
    'restaurants',
    'activities',
  ]);
  const firstImage = item.images[0];
  const isElevated = cardStyle === 'elevated';

  let resolvedCategory: string | undefined = categoryLabel;
  if (!resolvedCategory && item.type && TYPE_NS[item.type]) {
    resolvedCategory = t(`${TYPE_NS[item.type]}:title`);
  }
  if (!resolvedCategory && item.category?.name) {
    resolvedCategory = item.category.name.includes(':')
      ? t(item.category.name)
      : item.category.name;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={item.name}
      accessibilityRole="button">
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor={isElevated ? 'mainBackground' : 'surfaceBackground'}
        borderRadius="l"
        padding="xs"
        gap="m"
        style={[
          styles.card,
          isElevated && styles.elevated,
        ]}>
        <Box
          width={moderateScale(74)}
          height={moderateScale(74)}
          borderRadius="l"
          overflow="hidden">
          {firstImage ? (
            <Image
              source={{uri: firstImage}}
              style={styles.image}
              resizeMode={ResizeMode.cover}
            />
          ) : (
            <Box
              flex={1}
              backgroundColor="mainBackground"
              alignItems="center"
              justifyContent="center">
              <Icon source="image-off-outline" size={24} color="textSecondary" />
            </Box>
          )}
        </Box>
        <Box flex={1} gap="s">
          <Text numberOfLines={1} style={styles.title}>
            {item.name}
          </Text>
          <Box flexDirection="row" alignItems="center" gap="xs">
            <Icon source="navigation-variant" size={moderateScale(16)} color={palette.green500} />
            {item.distanceMeters != null && (
              <Text style={styles.distance}>{formatDistance(item.distanceMeters)}</Text>
            )}
            {resolvedCategory && (
              <Text style={styles.category}>{resolvedCategory}</Text>
            )}
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    paddingRight: moderateScale(8),
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.gray100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: moderateScale(16),
    color: palette.heading,
  },
  distance: {
    fontSize: moderateScale(12),
    color: palette.green500,
    fontWeight: '600',
  },
  category: {
    fontSize: moderateScale(14),
    color: palette.gray600,
  },
});
