import React, {useCallback, useMemo, useRef} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SwipeRow as SwipeRowImpl} from 'react-native-swipe-list-view';

// The shipped type definitions omit the `children` prop, so we re-cast the
// component to a React type that accepts children.
const SwipeRow = SwipeRowImpl as unknown as React.ComponentType<
  React.PropsWithChildren<{
    ref?: React.Ref<SwipeRowImpl<unknown>>;
    disableRightSwipe?: boolean;
    rightOpenValue?: number;
    rightActivationValue?: number;
    stopRightSwipe?: number;
    onRightAction?: () => void;
    closeOnRowPress?: boolean;
    friction?: number;
    tension?: number;
  }>
>;
import {Box, Text, Icon, Image, ResizeMode} from '../../../design';
import {useTheme} from '../../../theme';
import {useTranslation} from 'react-i18next';
import {moderateScale} from '../../../theme/scaling';
import {fonts} from '../../../theme/fonts';
import {palette} from '../../../theme/palette';
import type {RouteStop} from '../../../models/Route';
import {
  EXPERIENCE_TYPE_EMOJI,
  EXPERIENCE_TYPE_LABEL,
} from '../../../models/Route';

interface RouteItemCardProps {
  stop: RouteStop;
  isEditing: boolean;
  onPress?: () => void;
  onNavigate?: () => void;
  onDelete?: () => void;
  onToggleVisited?: () => void;
  drag?: () => void;
  isActive?: boolean;
}

export function RouteItemCard({
  stop,
  isEditing,
  onPress,
  onNavigate,
  onDelete,
  onToggleVisited,
  drag,
  isActive = false,
}: RouteItemCardProps) {
  const {theme} = useTheme();
  const {t} = useTranslation('routes');
  const swipeRowRef = useRef<SwipeRowImpl<unknown> | null>(null);

  const emoji = EXPERIENCE_TYPE_EMOJI[stop.experienceType];
  const typeLabel = EXPERIENCE_TYPE_LABEL[stop.experienceType];

  const handleSwipeAction = useCallback(() => {
    swipeRowRef.current?.closeRow();
    onToggleVisited?.();
  }, [onToggleVisited]);

  const handleRightAction = useCallback(() => {
    // Fired by SwipeRow when the user releases past rightActivationValue.
    // The row automatically animates back to 0 (rightActionValue defaults to 0).
    onToggleVisited?.();
  }, [onToggleVisited]);

  const hiddenContent = (
    <View style={styles.hiddenRow}>
      <TouchableOpacity
        onPress={handleSwipeAction}
        activeOpacity={0.8}
        accessibilityLabel={
          stop.visited ? t('markAsUnvisited') : t('markAsVisited')
        }
        style={styles.hiddenButton}>
        <Icon
          source="check-circle-outline"
          size={moderateScale(24)}
          color={palette.white}
        />
        <Text
          style={[
            styles.swipeActionText,
            {fontFamily: fonts.bold, color: palette.white},
          ]}>
          {stop.visited ? t('markAsUnvisited') : t('markAsVisited')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const innerContent = (
    <>
        {/* Edit mode: drag handle */}
        {isEditing && (
          <TouchableOpacity
            onPressIn={drag}
            accessibilityLabel={t('dragToReorder')}
            style={styles.dragHandle}>
            <Icon
              source="drag-horizontal"
              size={moderateScale(24)}
              color="textTertiary"
            />
          </TouchableOpacity>
        )}

        {/* Thumbnail */}
        {!isEditing && (
          <View style={styles.thumbnailContainer}>
            {stop.image ? (
              <Image
                source={{uri: stop.image}}
                style={styles.thumbnail}
                resizeMode={ResizeMode.cover}
              />
            ) : (
              <View
                style={[
                  styles.thumbnail,
                  {backgroundColor: theme.colors.surfaceBackground},
                ]}
              />
            )}
          </View>
        )}

        {/* Content column */}
        <Box flex={1} marginLeft="s" gap="xs">
          {/* Visited badge */}
          {!isEditing && stop.visited && (
            <Box flexDirection="row" alignItems="center" gap="xs">
              <Icon
                source="check-circle"
                size={moderateScale(12)}
                color={palette.green500}
              />
              <Text
                style={[
                  styles.visitedBadgeText,
                  {fontFamily: fonts.bold, color: palette.green500},
                ]}>
                {t('visitedBadge')}
              </Text>
            </Box>
          )}

          {/* Category row */}
          <Box flexDirection="row" alignItems="center" gap="xs">
            <Text style={styles.categoryEmoji}>{emoji}</Text>
            <Text
              style={[
                styles.categoryLabel,
                {fontFamily: fonts.bold, color: theme.colors.textSecondary},
              ]}>
              {typeLabel}
            </Text>
          </Box>

          {/* Name */}
          <Text
            style={[styles.stopName, {fontFamily: fonts.bold}]}
            numberOfLines={2}
            color="textHeading">
            {stop.name}
          </Text>
        </Box>

        {/* Right action button */}
        {isEditing ? (
          <TouchableOpacity
            onPress={onDelete}
            activeOpacity={0.7}
            accessibilityLabel={t('delete')}
            style={[styles.actionButton, {backgroundColor: palette.dangerLight}]}>
            <Icon
              source="trash-can-outline"
              size={moderateScale(18)}
              color={palette.dangerDark}
            />
          </TouchableOpacity>
        ) : stop.location?.latitude != null && stop.location?.longitude != null ? (
          <TouchableOpacity
            onPress={onNavigate}
            activeOpacity={0.7}
            accessibilityLabel={t('showOnMap', {defaultValue: 'Show on map'})}
            style={[
              styles.actionButton,
              {backgroundColor: theme.colors.accentGreenLight},
            ]}>
            <Icon
              source="map-marker-outline"
              size={moderateScale(18)}
              color={palette.green700}
            />
          </TouchableOpacity>
        ) : null}
    </>
  );

  const shellBaseStyle = useMemo(
    () => ({
      backgroundColor: theme.colors.cardBackground,
      borderColor: theme.colors.border,
    }),
    [theme.colors.cardBackground, theme.colors.border],
  );

  // Wrap in SwipeRow only in normal mode
  if (isEditing) {
    return (
      <View style={styles.cardWrapper}>
        <View
          style={[styles.shell, shellBaseStyle, styles.shellStaticCorners]}>
          {innerContent}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardWrapper}>
      <SwipeRow
        ref={swipeRowRef}
        disableRightSwipe
        rightOpenValue={-ACTION_WIDTH}
        rightActivationValue={-HALF_CARD_WIDTH}
        stopRightSwipe={-HALF_CARD_WIDTH - moderateScale(40)}
        onRightAction={handleRightAction}
        closeOnRowPress
        friction={8}
        tension={40}>
        {hiddenContent}
        <CardShell
          isActive={isActive}
          shellBaseStyle={shellBaseStyle}
          onPress={onPress}>
          {innerContent}
        </CardShell>
      </SwipeRow>
    </View>
  );
}

type CardShellProps = {
  children: React.ReactNode;
  isActive?: boolean;
  shellBaseStyle: {backgroundColor: string; borderColor: string};
  onPress?: () => void;
  swipeAnimatedValue?: Animated.AnimatedInterpolation<number>;
};

function CardShell({
  children,
  isActive,
  shellBaseStyle,
  onPress,
  swipeAnimatedValue,
}: CardShellProps) {
  const rightRadius = swipeAnimatedValue
    ? swipeAnimatedValue.interpolate({
        inputRange: [-20, -6, 0],
        outputRange: [0, 0, BORDER_RADIUS],
        extrapolate: 'clamp',
      })
    : BORDER_RADIUS;

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} disabled={!onPress}>
      <Animated.View
        style={[
          styles.shell,
          shellBaseStyle,
          isActive && styles.activeElevation,
          {
            borderTopLeftRadius: BORDER_RADIUS,
            borderBottomLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: rightRadius,
            borderBottomRightRadius: rightRadius,
          },
        ]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

const THUMBNAIL_SIZE = moderateScale(74);
const ACTION_BUTTON_SIZE = moderateScale(32);
const ACTION_WIDTH = moderateScale(100);
const BORDER_RADIUS = moderateScale(16);
const WRAPPER_HORIZONTAL_MARGIN = moderateScale(16);
const HALF_CARD_WIDTH =
  (Dimensions.get('window').width - WRAPPER_HORIZONTAL_MARGIN * 2) / 2;

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: WRAPPER_HORIZONTAL_MARGIN,
    marginBottom: moderateScale(8),
  },
  hiddenRow: {
    flex: 1,
    backgroundColor: palette.green500,
    borderRadius: BORDER_RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  hiddenButton: {
    width: ACTION_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(4),
  },
  shell: {
    borderWidth: 1,
    padding: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: palette.gray900,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  shellStaticCorners: {
    borderRadius: BORDER_RADIUS,
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  dragHandle: {
    padding: moderateScale(4),
    marginRight: moderateScale(4),
  },
  categoryEmoji: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
  },
  categoryLabel: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
  },
  stopName: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.25),
  },
  visitedBadgeText: {
    fontSize: moderateScale(11),
    lineHeight: moderateScale(14),
  },
  actionButton: {
    width: ACTION_BUTTON_SIZE,
    height: ACTION_BUTTON_SIZE,
    borderRadius: ACTION_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: moderateScale(8),
  },
  swipeActionText: {
    fontSize: moderateScale(11),
    lineHeight: moderateScale(14),
    textAlign: 'center',
  },
  activeElevation: {
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
});
