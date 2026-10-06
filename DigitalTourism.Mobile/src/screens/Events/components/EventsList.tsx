import React, {useCallback, useMemo} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import {Box, Text} from '../../../design';
import {Event} from '../../../models/Event';
import {EventCard} from './EventCard';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../../theme';
import {useTranslation} from 'react-i18next';
import {CardSkeleton} from '../../../components/skeletons';
import {ErrorState} from '../../../components/shared/ErrorState';

interface EventsListProps {
  events: Event[];
  onEventPress: (event: Event) => void;
  onFavoritePress?: (event: Event) => void;
  isFavourited?: (id: string | number) => boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  onScroll?: ReturnType<typeof import('react-native-reanimated').useAnimatedScrollHandler>;
  contentPaddingTop?: number;
  userLocation?: {latitude: number; longitude: number} | null;
  listRef?: React.RefObject<Animated.FlatList<Event> | null>;
}

function haversineDistance(
  lat1: number, lng1: number, lat2: number, lng2: number,
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const EventListItem = React.memo(function EventListItem({
  event,
  onPress,
  onFavoritePress,
  isFavourited,
  distanceMeters,
}: {
  event: Event;
  onPress: (e: Event) => void;
  onFavoritePress?: (e: Event) => void;
  isFavourited?: boolean;
  distanceMeters?: number | null;
}) {
  const handlePress = useCallback(() => onPress(event), [onPress, event]);
  const handleFavorite = useCallback(() => onFavoritePress?.(event), [onFavoritePress, event]);
  return (
    <EventCard
      event={event}
      onPress={handlePress}
      onFavoritePress={onFavoritePress ? handleFavorite : undefined}
      isFavourited={isFavourited}
      distanceMeters={distanceMeters}
    />
  );
});

function EmptyComponent() {
  const {t} = useTranslation('events');
  return (
    <Box flex={1} justifyContent="center" alignItems="center" padding="xl">
      <Text variant="title" textAlign="center" marginBottom="m">
        {t('noEvents.title')}
      </Text>
      <Text variant="body" color="textSecondary" textAlign="center">
        {t('noEvents.message')}
      </Text>
    </Box>
  );
}

/**
 * List component for displaying events with infinite scroll support.
 * Uses Animated.FlatList to support Reanimated scroll handlers for the collapsible header.
 */
export function EventsList({
  events,
  onEventPress,
  onFavoritePress,
  isFavourited,
  isLoading,
  isError,
  onRefresh,
  refreshing,
  onLoadMore,
  isLoadingMore,
  onScroll,
  contentPaddingTop = 0,
  userLocation,
  listRef,
}: EventsListProps) {
  const theme = useTheme<Theme>();

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <Box paddingVertical="m" justifyContent="center" alignItems="center">
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </Box>
    );
  }, [isLoadingMore, theme.colors.primary]);

  // Pre-compute distances once when events or userLocation change (not per-render)
  const distanceMap = useMemo(() => {
    if (!userLocation) return null;
    const map = new Map<string, number>();
    for (const event of events) {
      map.set(
        event.id,
        haversineDistance(
          userLocation.latitude, userLocation.longitude,
          event.location.latitude, event.location.longitude,
        ),
      );
    }
    return map;
  }, [events, userLocation]);

  const renderItem = useCallback(
    ({item}: {item: Event}) => (
      <EventListItem
        event={item}
        onPress={onEventPress}
        onFavoritePress={onFavoritePress}
        isFavourited={isFavourited?.(item.id) ?? false}
        distanceMeters={distanceMap?.get(item.id) ?? null}
      />
    ),
    [onEventPress, onFavoritePress, isFavourited, distanceMap],
  );

  const skeletonStyle = useMemo(
    () => ({paddingTop: contentPaddingTop}),
    [contentPaddingTop],
  );

  const {t: tErrors} = useTranslation('errors');

  if (isLoading && events.length === 0) {
    return (
      <Box style={skeletonStyle}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </Box>
    );
  }

  if (isError && events.length === 0) {
    return (
      <Box style={skeletonStyle} flex={1}>
        <ErrorState
          title={tErrors('screen.title')}
          subtitle={tErrors('screen.subtitle')}
          retryLabel={tErrors('screen.retry')}
          onRetry={onRefresh ?? (() => {})}
        />
      </Box>
    );
  }

  return (
    <Animated.FlatList
      ref={listRef}
      data={events}
      renderItem={renderItem}
      keyExtractor={(item: Event) => item.id}
      contentContainerStyle={
        events.length === 0
          ? [styles.centerContent, {paddingTop: contentPaddingTop}]
          : [styles.listContent, {paddingTop: contentPaddingTop + 8}]
      }
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={EmptyComponent}
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      onScroll={onScroll}
      scrollEventThrottle={16}
      maxToRenderPerBatch={15}
      windowSize={10}
      removeClippedSubviews={true}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
