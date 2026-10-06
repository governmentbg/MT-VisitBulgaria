import React, {useCallback} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {FlatList, Box, Text} from '../../design';
import {Event} from '../../models/Event';
import {EventCard} from '../../screens/Events/components/EventCard';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../theme';
import {useTranslation} from 'react-i18next';

interface EventsListProps {
  events: Event[];
  onEventPress: (event: Event) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

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
 * List component for displaying events with infinite scroll support
 */
export function EventsList({
  events,
  onEventPress,
  isLoading,
  onRefresh,
  refreshing,
  onLoadMore,
  isLoadingMore,
  hasMore: _hasMore,
}: EventsListProps) {
  const theme = useTheme<Theme>();

  const renderItem = useCallback(
    ({item}: {item: Event}) => (
      <EventCard event={item} onPress={() => onEventPress(item)} />
    ),
    [onEventPress],
  );

  const keyExtractor = useCallback((item: Event) => item.id, []);

  // Render footer with loading indicator for infinite scroll
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;

    return (
      <Box paddingVertical="m" justifyContent="center" alignItems="center">
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </Box>
    );
  }, [isLoadingMore, theme.colors.primary]);

  // Loading state - show spinner while maintaining pull-to-refresh
  if (isLoading && events.length === 0) {
    return (
      <FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={() => 'loading'}
        contentContainerStyle={[styles.listContent, styles.centerContent]}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </Box>
        }
      />
    );
  }

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={events.length === 0 ? styles.centerContent : styles.listContent}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={EmptyComponent}
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
