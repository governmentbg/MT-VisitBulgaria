import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Box, Text, Pressable, Image, Icon} from '../../../design';
import {Event, EventStatus} from '../../../models/Event';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../../theme';
import {useTranslation} from 'react-i18next';
import {moderateScale, verticalScale} from '../../../theme/scaling';
import {fonts} from '../../../theme/fonts';
import {palette} from '../../../theme/palette';
import {extractPlainText} from '../../../services/api/transforms/payloadHelpers';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavourited?: boolean;
  distanceMeters?: number | null;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Event card component matching Figma design:
 * - Image with date badge overlay and favorite button
 * - Status label, title, location, and description
 */
export const EventCard = React.memo(function EventCard({event, onPress, onFavoritePress, isFavourited, distanceMeters}: EventCardProps) {
  const theme = useTheme<Theme>();
  const {t, i18n} = useTranslation('events');

  const dateParts = useMemo(() => {
    const date = new Date(event.period.startDate);
    return {
      month: date.toLocaleString(i18n.language, {month: 'short'}),
      day: date.getDate().toString(),
      year: date.getFullYear().toString(),
    };
  }, [event.period.startDate, i18n.language]);

  const statusColor =
    event.status === EventStatus.ACTIVE
      ? palette.green500
      : event.status === EventStatus.UPCOMING
        ? palette.green800
        : palette.gray600;

  const locationText = event.address || '';

  return (
    <Pressable onPress={onPress}>
      <Box
        backgroundColor="cardBackground"
        borderRadius="xl"
        marginHorizontal="m"
        marginBottom="m"
        shadowColor="gray800"
        shadowOffset={{width: 0, height: 2}}
        shadowOpacity={0.08}
        shadowRadius={8}
        elevation={4}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {event.images && event.images.length > 0 ? (
            <Image
              source={{uri: event.images[0]}}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.image,
                {backgroundColor: theme.colors.surfaceBackground},
              ]}
            />
          )}

          {/* Date Badge */}
          <View style={styles.dateBadge}>
            <Text
              style={[
                styles.dateBadgeMonth,
                {fontFamily: fonts.bold},
              ]}>
              {dateParts.month}
            </Text>
            <Text
              style={[
                styles.dateBadgeDay,
                {fontFamily: fonts.bold, color: palette.green500},
              ]}>
              {dateParts.day}
            </Text>
            <Text
              style={[
                styles.dateBadgeYear,
                {fontFamily: fonts.bold},
              ]}>
              {dateParts.year}
            </Text>
          </View>

          {/* Favorite Button — only visible when onFavoritePress is provided (i.e. user is logged in) */}
          {onFavoritePress && (
            <TouchableOpacity
              onPress={onFavoritePress}
              activeOpacity={0.7}
              style={styles.favoriteButton}
              hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
              <Box
                width={moderateScale(32)}
                height={moderateScale(32)}
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
                style={styles.favoriteBg}>
                <Icon
                  source={isFavourited ? 'heart' : 'heart-outline'}
                  size={moderateScale(16)}
                  color="primary"
                />
              </Box>
            </TouchableOpacity>
          )}
        </View>

        {/* Content Section */}
        <Box paddingHorizontal="m" paddingBottom="l" paddingTop="m" gap="xs">
          {/* Status + Distance Row */}
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text
              style={[
                styles.statusLabel,
                {color: statusColor, fontFamily: fonts.bold},
              ]}>
              {t(`status.${event.status}`)}
            </Text>
            {distanceMeters != null && (
              <Box flexDirection="row" alignItems="center" gap="xs">
                <Icon source="map-marker-distance" size={moderateScale(14)} color={palette.green700} />
                <Text style={styles.distanceText}>{formatDistance(distanceMeters)}</Text>
              </Box>
            )}
          </Box>

          {/* Event Name */}
          <Text
            style={styles.eventName}
            fontFamily={fonts.bold}
            numberOfLines={2}>
            {event.name}
          </Text>

          {/* Location Row */}
          {locationText ? (
            <Box flexDirection="row" alignItems="center" gap="s">
              <Icon
                source="map-marker-outline"
                size={moderateScale(16)}
                color={palette.gray600}
              />
              <Text
                style={[styles.locationText, {fontFamily: fonts.bold}]}
                numberOfLines={1}>
                {locationText}
              </Text>
            </Box>
          ) : null}

          {/* Description */}
          {(() => {
            const descriptionText = extractPlainText(event.description);
            return descriptionText ? (
              <Text style={styles.description} numberOfLines={2}>
                {descriptionText}
              </Text>
            ) : null;
          })()}
        </Box>
      </Box>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  imageContainer: {
    height: verticalScale(162),
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    left: moderateScale(16),
    top: moderateScale(16),
    backgroundColor: 'white',
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: palette.green50,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.gray900,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dateBadgeMonth: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14),
    color: palette.black,
  },
  dateBadgeDay: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
  },
  dateBadgeYear: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14),
    color: palette.black,
  },
  favoriteButton: {
    position: 'absolute',
    right: moderateScale(16),
    top: moderateScale(16),
  },
  favoriteBg: {
    backgroundColor: palette.green50,
  },
  statusLabel: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(12),
  },
  eventName: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18 * 1.2),
    color: palette.heading,
  },
  locationText: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(12),
    color: palette.gray600,
  },
  description: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14 * 1.5),
    color: palette.gray600,
  },
  distanceText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.bold,
    color: palette.green700,
  },
});
