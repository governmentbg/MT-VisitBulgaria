import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Box, Text, Icon, Image, type IconName} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {formatDistance} from '../../utils/mapHelpers';
import type {MapItem} from '../../types/map';

interface MapListCardProps {
  item: MapItem;
  onPress: () => void;
  onFavourite?: () => void;
  isFavourited?: boolean;
  distanceMeters?: number | null;
}

/**
 * Card component for the map list view.
 * Shows hero image, category, title, and description.
 * Matches Figma design: white card, rounded corners, favourite button on image.
 */
function MapListCardComponent({item, onPress, onFavourite, isFavourited, distanceMeters}: MapListCardProps) {
  const {t: tMap} = useTranslation('map');
  const {t: tCommon} = useTranslation('common');
  const isEvent = 'period' in item;
  const firstImage = item.images[0];
  const categoryName = tMap(`filterLabels.${item.category.name}`, {defaultValue: item.category.name});

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={item.name}
      accessibilityRole="button">
      <Box
        backgroundColor="mainBackground"
        borderRadius="l"
        overflow="hidden"
        style={styles.card}>
        {/* Hero image */}
        <Box height={moderateScale(162)} overflow="hidden">
          {firstImage ? (
            <Image source={{uri: firstImage}} style={styles.image} resizeMode="cover" />
          ) : (
            <Box
              flex={1}
              backgroundColor="surfaceBackground"
              alignItems="center"
              justifyContent="center">
              <Icon
                source={item.category.icon as IconName}
                size={moderateScale(48)}
                color="textSecondary"
              />
            </Box>
          )}

          {/* Favourite button */}
          {onFavourite && (
            <TouchableOpacity
              onPress={onFavourite}
              activeOpacity={0.7}
              style={styles.favouriteButton}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              accessibilityLabel={tCommon('addToFavourites')}
              accessibilityRole="button">
              <Box
                width={moderateScale(32)}
                height={moderateScale(32)}
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
                style={styles.favouriteBg}>
                <Icon
                  source={isFavourited ? 'heart' : 'heart-outline'}
                  size={moderateScale(16)}
                  color="primary"
                />
              </Box>
            </TouchableOpacity>
          )}
        </Box>

        {/* Content */}
        <Box
          paddingHorizontal="m"
          paddingBottom="l"
          paddingTop="m"
          gap="xs">
          {/* Category + distance row */}
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text
              variant="small"
              fontFamily={fonts.bold}
              color="textSecondary"
              numberOfLines={1}>
              {isEvent ? '📅' : '🏛️'} {categoryName}
            </Text>
            {distanceMeters != null && (
              <Box flexDirection="row" alignItems="center" gap="xs">
                <Icon source="map-marker-distance" size={moderateScale(14)} color={palette.green700} />
                <Text style={styles.distanceText}>
                  {formatDistance(distanceMeters)}
                </Text>
              </Box>
            )}
          </Box>

          {/* Title */}
          <Text
            fontFamily={fonts.bold}
            color="textPrimary"
            numberOfLines={2}
            style={styles.title}>
            {item.name}
          </Text>

          {/* Description — Payload CMS returns Lexical rich text objects, extract plain text */}
          {typeof item.description === 'string' && item.description.length > 0 && (
            <Text
              variant="bodyMedium"
              color="textSecondary"
              numberOfLines={2}
              style={styles.description}>
              {item.description}
            </Text>
          )}
        </Box>
      </Box>
    </TouchableOpacity>
  );
}

export const MapListCard = React.memo(MapListCardComponent);

const styles = StyleSheet.create({
  card: {
    shadowColor: palette.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favouriteButton: {
    position: 'absolute',
    top: moderateScale(16),
    right: moderateScale(16),
  },
  favouriteBg: {
    backgroundColor: palette.green50,
  },
  title: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18 * 1.2),
  },
  description: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14 * 1.5),
  },
  distanceText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.bold,
    color: palette.green700,
  },
});
