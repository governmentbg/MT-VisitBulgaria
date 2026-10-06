import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Box, Text, Icon, Image} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import type {FavouriteItem, FavouriteExperienceType} from '../../models/Favourite';
import {TYPE_EMOJI} from '../../constants';

const TYPE_LABEL_KEY: Record<FavouriteExperienceType, string> = {
  attractions: 'typeAttractions',
  events: 'typeEvents',
  hotels: 'typeHotels',
  restaurants: 'typeRestaurants',
  activities: 'typeActivities',
};

interface FavouriteCardProps {
  item: FavouriteItem;
  onPress: () => void;
  onUnfavourite: () => void;
  isRemoving?: boolean;
}

function FavouriteCardComponent({
  item,
  onPress,
  onUnfavourite,
  isRemoving,
}: FavouriteCardProps) {
  const {t} = useTranslation('favourites');

  const isEvent = item.type === 'events';

  const eventDate = useMemo(() => {
    if (!isEvent || !item.startDate) return null;
    const date = new Date(item.startDate);
    return {
      month: date.toLocaleString('en', {month: 'long'}),
      day: date.getDate(),
      year: date.getFullYear(),
    };
  }, [isEvent, item.startDate]);

  const categoryLabel = `${TYPE_EMOJI[item.type]} ${t(TYPE_LABEL_KEY[item.type])}`;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box
        backgroundColor="mainBackground"
        borderRadius="xl"
        overflow="hidden"
        style={styles.card}>
        {/* Hero image */}
        <Box height={moderateScale(162)} overflow="hidden">
          {item.imageUrl ? (
            <Image source={{uri: item.imageUrl}} style={styles.image} resizeMode="cover" />
          ) : (
            <Box
              flex={1}
              backgroundColor="surfaceBackground"
              alignItems="center"
              justifyContent="center">
              <Text style={styles.placeholderEmoji}>
                {TYPE_EMOJI[item.type]}
              </Text>
            </Box>
          )}

          {/* Event date badge */}
          {isEvent && eventDate && (
            <Box
              style={styles.dateBadge}
              backgroundColor="mainBackground"
              borderRadius="xl"
              padding="s"
              alignItems="center"
              justifyContent="center">
              <Text
                fontFamily={fonts.bold}
                color="textPrimary"
                style={styles.dateMonth}>
                {eventDate.month}
              </Text>
              <Text
                fontFamily={fonts.bold}
                color="accentGreen"
                style={styles.dateDay}>
                {eventDate.day}
              </Text>
              <Text
                fontFamily={fonts.bold}
                color="textPrimary"
                style={styles.dateYear}>
                {eventDate.year}
              </Text>
            </Box>
          )}

          {/* Favourite (heart) button */}
          <TouchableOpacity
            onPress={onUnfavourite}
            activeOpacity={0.7}
            disabled={isRemoving}
            style={styles.favouriteButton}
            hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
            <Box
              width={moderateScale(32)}
              height={moderateScale(32)}
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
              style={[styles.favouriteBg, isRemoving && styles.disabledBg]}>
              <Icon
                source="heart"
                size={moderateScale(16)}
                color="primary"
              />
            </Box>
          </TouchableOpacity>
        </Box>

        {/* Content */}
        <Box
          paddingHorizontal="m"
          paddingBottom="l"
          paddingTop="m"
          gap="xs">
          {/* Category / status label */}
          {isEvent ? (
            <Text
              fontFamily={fonts.bold}
              style={styles.categoryLabel}
              numberOfLines={1}
              color="accentGreenDarker">
              {t('upcoming')}
            </Text>
          ) : (
            <Text
              variant="small"
              fontFamily={fonts.bold}
              color="textSecondary"
              numberOfLines={1}>
              {categoryLabel}
            </Text>
          )}

          {/* Title */}
          <Text
            fontFamily={fonts.bold}
            color="textHeading"
            numberOfLines={2}
            style={styles.title}>
            {item.title}
          </Text>

          {/* Location (for events) */}
          {isEvent && item.cityName && (
            <Box flexDirection="row" alignItems="center" gap="s">
              <Icon
                source="map-marker-outline"
                size={moderateScale(16)}
                color="textSecondary"
              />
              <Text
                variant="small"
                fontFamily={fonts.bold}
                color="textSecondary"
                numberOfLines={1}>
                {item.cityName}
              </Text>
            </Box>
          )}

          {/* Star rating (for hotels) */}
          {item.type === 'hotels' && item.starRating != null && (
            <Box flexDirection="row" alignItems="center" gap="xs">
              {Array.from({length: item.starRating}).map((_, i) => (
                <Icon
                  key={i}
                  source="star"
                  size={moderateScale(14)}
                  color="warning"
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </TouchableOpacity>
  );
}

export const FavouriteCard = React.memo(FavouriteCardComponent);

const styles = StyleSheet.create({
  card: {
    shadowColor: '#141414',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderEmoji: {
    fontSize: moderateScale(48),
  },
  favouriteButton: {
    position: 'absolute',
    top: moderateScale(16),
    right: moderateScale(16),
  },
  favouriteBg: {
    backgroundColor: '#E6F8F6',
  },
  disabledBg: {
    opacity: 0.5,
  },
  dateBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -moderateScale(30)}, {translateY: -moderateScale(35)}],
    shadowColor: '#141414',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E6F8F6',
    minWidth: moderateScale(60),
  },
  categoryLabel: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(12),
  },
  title: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18 * 1.2),
  },
  dateMonth: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14),
  },
  dateDay: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
  },
  dateYear: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14),
  },
});
