import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Box, Text, Pressable, Image, Icon} from '../../../design';
import {useTheme} from '../../../theme';
import {useTranslation} from 'react-i18next';
import {moderateScale} from '../../../theme/scaling';
import {fonts} from '../../../theme/fonts';
import {palette} from '../../../theme/palette';
import {Route} from '../../../models/Route';
import {RouteProgressBar} from './RouteProgressBar';
import {RouteCardMenu} from './RouteCardMenu';
import {formatDateRange} from '../../../utils/dateHelpers';

interface RouteCardProps {
  route: Route;
  onPress: () => void;
  onEdit: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export const RouteCard = React.memo(function RouteCard({
  route,
  onPress,
  onEdit,
  onDownload,
  onDelete,
}: RouteCardProps) {
  const {theme} = useTheme();
  const {t, i18n} = useTranslation('routes');
  const [menuVisible, setMenuVisible] = useState(false);

  const allStops = useMemo(
    () => [...route.days.flatMap(day => day.stops), ...route.pool],
    [route.days, route.pool],
  );

  const {visited, total} = useMemo(
    () => ({
      visited: allStops.filter(stop => stop.visited).length,
      total: allStops.length,
    }),
    [allStops],
  );

  const MAX_THUMBNAILS = 7;
  const thumbnails = useMemo(
    () =>
      allStops
        .filter(stop => stop.image)
        .slice(0, MAX_THUMBNAILS)
        .map(stop => stop.image!),
    [allStops],
  );
  const overflowCount = Math.max(0, allStops.length - thumbnails.length);

  const dateLabel = useMemo(
    () => formatDateRange(route.startDate, route.duration, i18n.language),
    [route.startDate, route.duration, i18n.language],
  );

  const durationLabel = t('dayCount', {count: route.duration});

  return (
    <Box
      marginHorizontal="m"
      marginBottom="m"
      borderRadius="xl"
      backgroundColor="cardBackground"
      shadowColor="gray800"
      shadowOffset={{width: 0, height: 2}}
      shadowOpacity={0.08}
      shadowRadius={8}
      elevation={4}>
      <Pressable
        onPress={onPress}
        borderRadius="xl"
        backgroundColor="cardBackground">
        <Box padding="m">
        {/* Title row */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="s">
          <Text
            style={[styles.title, {fontFamily: fonts.bold}]}
            numberOfLines={1}
            flex={1}>
            {route.name}
          </Text>
          <Pressable onPress={() => setMenuVisible(true)} hitSlop={12}>
            <Icon
              source="dots-horizontal"
              size={moderateScale(24)}
              color={palette.gray600}
            />
          </Pressable>
          <RouteCardMenu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            routeName={route.name}
            onEdit={onEdit}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        </Box>

        {/* Date + duration subtitle */}
        <Text
          style={[styles.subtitle, {fontFamily: fonts.regular}]}
          numberOfLines={1}>
          {dateLabel} {'\u00B7'} {durationLabel}
        </Text>

        {/* Progress bar */}
        <Box marginTop="m" marginBottom="m">
          <RouteProgressBar visited={visited} total={total} />
        </Box>

        {/* Thumbnail row */}
        {(thumbnails.length > 0 || overflowCount > 0) && (
          <View style={styles.thumbnailRow}>
            {thumbnails.map((uri, index) => (
              <View
                key={`${uri}_${index}`}
                style={[
                  styles.thumbnailWrapper,
                  index > 0 && styles.thumbnailOverlap,
                  {
                    zIndex: thumbnails.length + 1 - index,
                    borderColor: theme.colors.cardBackground,
                  },
                ]}>
                <Image
                  source={{uri}}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </View>
            ))}
            {overflowCount > 0 && (
              <View
                style={[
                  styles.thumbnailWrapper,
                  styles.overflowWrapper,
                  thumbnails.length > 0 && styles.thumbnailOverlap,
                  styles.overflowZIndex,
                ]}>
                <Text
                  style={[styles.overflowText, {fontFamily: fonts.bold}]}>
                  {`${overflowCount}+`}
                </Text>
              </View>
            )}
          </View>
        )}
        </Box>
      </Pressable>
    </Box>
  );
});

const THUMBNAIL_SIZE = moderateScale(40);

const styles = StyleSheet.create({
  title: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18 * 1.3),
    color: palette.heading,
  },
  subtitle: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    color: palette.gray600,
  },
  thumbnailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailWrapper: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: THUMBNAIL_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  thumbnailOverlap: {
    marginLeft: moderateScale(-10),
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overflowWrapper: {
    backgroundColor: palette.gray100,
    borderColor: palette.gray300,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overflowZIndex: {
    zIndex: 0,
  },
  overflowText: {
    fontSize: moderateScale(12),
    color: palette.gray800,
  },
});
