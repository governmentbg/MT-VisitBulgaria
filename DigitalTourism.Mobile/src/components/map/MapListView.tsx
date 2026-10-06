import React, {useCallback, useMemo} from 'react';
import {StyleSheet, ListRenderItemInfo, TextInput, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {Box, Text, Icon} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {fonts} from '../../theme/fonts';
import {MapListCard} from './MapListCard';
import type {SearchSuggestion} from './SearchBarOverlay';
import {MapSegmentedControl, type MapViewMode} from './MapSegmentedControl';
import {MapFab} from './MapFab';
import type {MapListFilters} from './MapListFiltersModal';
import FilterIcon from '../../assets/icons/filter.svg';
import {useInfiniteSearch} from '../../hooks/queries/useInfiniteSearch';
import {haversineDistanceMeters} from '../../utils/mapHelpers';
import {hitToMapItem} from '../../utils/searchHitTransforms';
import {ListItemSkeleton} from '../skeletons';
import type {SearchFilters, FacetValue} from '../../services/api/types/searchTypes';
import type {MapItem} from '../../types/map';
import {useAuth} from '../../contexts/AuthContext';
import {useFavourites} from '../../hooks/queries/useFavourites';
import {useAddFavourite, useRemoveFavourite} from '../../hooks/mutations/useToggleFavourite';
import type {FavouriteExperienceType} from '../../models/Favourite';
import {useCollapsibleHeader} from '../../hooks/useCollapsibleHeader';

const SEARCH_ROW_HEIGHT = moderateScale(8) + moderateScale(48);
const CONTROLS_ROW_HEIGHT =
  moderateScale(8) + moderateScale(32) + moderateScale(8);
const SUBTITLE_ROW_HEIGHT = moderateScale(8) + moderateScale(14 * 1.5);
const HEADER_PADDING_BOTTOM_EXPANDED = 0;
const HEADER_PADDING_BOTTOM_COLLAPSED = moderateScale(8);

const SOURCE_TO_RELATION: Record<string, FavouriteExperienceType> = {
  attraction: 'attractions',
  event: 'events',
  hotel: 'hotels',
  restaurant: 'restaurants',
  activity: 'activities',
};

const SKELETON_KEYS = [0, 1, 2, 3, 4] as const;

interface MapListViewProps {
  items: MapItem[];
  viewMode: MapViewMode;
  onModeChange: (mode: MapViewMode) => void;
  onItemPress: (item: MapItem) => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSuggestionPress?: (suggestion: SearchSuggestion) => void;
  filters: MapListFilters;
  onFiltersChange: (filters: MapListFilters) => void;
  filterCount: number;
  onFilterPress: () => void;
  facets: Record<string, FacetValue[]>;
  userLocation?: {latitude: number; longitude: number} | null;
}

const ListItem = React.memo(function ListItem({
  item,
  onPress,
  onFavourite,
  isFavourited,
  distanceMeters,
}: {
  item: MapItem;
  onPress: (item: MapItem) => void;
  onFavourite?: (item: MapItem) => void;
  isFavourited?: boolean;
  distanceMeters?: number | null;
}) {
  const handlePress = useCallback(() => onPress(item), [onPress, item]);
  const handleFavourite = useCallback(() => onFavourite?.(item), [onFavourite, item]);
  return (
    <MapListCard
      item={item}
      onPress={handlePress}
      onFavourite={onFavourite ? handleFavourite : undefined}
      isFavourited={isFavourited}
      distanceMeters={distanceMeters}
    />
  );
});

const SINGULAR_MAP: Record<string, string> = {
  attractions: 'attraction', events: 'event', hotels: 'hotel',
  restaurants: 'restaurant', activities: 'activity',
};

/**
 * List view for the map screen.
 * Shows a scrollable list of attraction/event cards with a sticky header.
 * Matches Figma: search bar → segmented control + filter → subtitle → card list.
 */
export function MapListView({
  viewMode,
  onModeChange,
  onItemPress,
  searchQuery,
  onSearchChange,
  filters,
  filterCount,
  onFilterPress,
  userLocation,
}: MapListViewProps) {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation('map');

  const fullHeaderHeight =
    insets.top +
    SEARCH_ROW_HEIGHT +
    CONTROLS_ROW_HEIGHT +
    SUBTITLE_ROW_HEIGHT +
    HEADER_PADDING_BOTTOM_EXPANDED;
  const collapsedHeaderHeight =
    insets.top + SEARCH_ROW_HEIGHT + HEADER_PADDING_BOTTOM_COLLAPSED;

  const {
    scrollHandler,
    headerAnimatedStyle,
    titleAnimatedStyle: controlsAnimatedStyle,
    chipsAnimatedStyle: subtitleAnimatedStyle,
  } = useCollapsibleHeader({
    fullHeight: fullHeaderHeight,
    collapsedHeight: collapsedHeaderHeight,
    titleSectionHeight: CONTROLS_ROW_HEIGHT,
    chipsSectionHeight: SUBTITLE_ROW_HEIGHT,
    paddingExpanded: HEADER_PADDING_BOTTOM_EXPANDED,
    paddingCollapsed: HEADER_PADDING_BOTTOM_COLLAPSED,
  });
  const {isAuthenticated, login} = useAuth();
  const {data: favourites} = useFavourites(isAuthenticated);
  const addFavourite = useAddFavourite();
  const removeFavourite = useRemoveFavourite();

  const handleFavourite = useCallback((item: MapItem) => {
    if (!isAuthenticated) {
      login();
      return;
    }
    const relationTo = SOURCE_TO_RELATION[item.__source];
    if (!relationTo) return;
    const favItem = favourites?.find(f => f.id === `${relationTo}_${item.id}`);
    if (favItem) {
      removeFavourite.mutate(favItem.favouriteId);
      return;
    }
    const numericId = parseInt(String(item.id), 10);
    if (isNaN(numericId)) return;
    addFavourite.mutate({relationTo, experienceId: numericId});
  }, [isAuthenticated, login, favourites, addFavourite, removeFavourite]);

  const favouriteIds = useMemo(() => {
    const set = new Set<string>();
    favourites?.forEach(f => set.add(f.id));
    return set;
  }, [favourites]);

  // Build SearchFilters from shared filters
  const searchFilters = useMemo((): SearchFilters | undefined => {
    const f: SearchFilters = {};
    if (filters.type.length > 0) f.type = filters.type.map(v => SINGULAR_MAP[v] || v);
    if (filters.categories.length > 0) f.categories = filters.categories;
    if (filters.cities.length > 0) f.city = filters.cities;
    if (filters.municipality.length > 0) f.municipality = filters.municipality;
    if (filters.region.length > 0) f.region = filters.region;
    if (filters.starRating.length > 0) f.starRating = filters.starRating.map(Number);
    if (filters.amenities.length > 0) f.amenities = filters.amenities;
    if (filters.cuisineType.length > 0) f.cuisineType = filters.cuisineType;
    if (filters.dietaryOptions.length > 0) f.dietaryOptions = filters.dietaryOptions;
    if (filters.difficultyLevel.length > 0) f.difficultyLevel = filters.difficultyLevel;
    if (filters.seasonality.length > 0) f.seasonality = filters.seasonality;
    if (filters.organizer.length > 0) f.organizer = filters.organizer;
    return Object.keys(f).length > 0 ? f : undefined;
  }, [filters]);

  const {
    data: searchData,
    isLoading: isSearching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearch({
    query: searchQuery.length >= 2 ? searchQuery : '*',
    filters: searchFilters,
    perPage: 20,
    geoSort: userLocation ? {lat: userLocation.latitude, lng: userLocation.longitude} : undefined,
    sortBy: searchQuery.length >= 2 && !userLocation ? '_text_match:desc' : undefined,
  });

  // Always show Typesense results (full dataset, not limited to map viewport)
  const displayItems = useMemo<MapItem[]>(() => {
    if (!searchData?.pages) return [];
    return searchData.pages.flatMap(page =>
      page.hits.map(hit => hitToMapItem(hit) as MapItem),
    );
  }, [searchData]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  // Pre-compute distances once when items or userLocation change (not per-render)
  const distanceMap = useMemo(() => {
    if (!userLocation) return null;
    const map = new Map<string, number>();
    for (const item of displayItems) {
      map.set(
        item.id,
        haversineDistanceMeters(
          userLocation.latitude, userLocation.longitude,
          item.location.latitude, item.location.longitude,
        ),
      );
    }
    return map;
  }, [displayItems, userLocation]);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<MapItem>) => {
      const relationTo = SOURCE_TO_RELATION[item.__source];
      const isFavourited = relationTo ? favouriteIds.has(`${relationTo}_${item.id}`) : false;
      return (
        <ListItem
          item={item}
          onPress={onItemPress}
          onFavourite={isAuthenticated ? handleFavourite : undefined}
          isFavourited={isFavourited}
          distanceMeters={distanceMap?.get(item.id) ?? null}
        />
      );
    },
    [onItemPress, handleFavourite, favouriteIds, distanceMap, isAuthenticated],
  );

  const keyExtractor = useCallback((item: MapItem) => item.id, []);

  const listContentStyle = useMemo(
    () => [
      styles.listContent,
      {paddingTop: fullHeaderHeight + moderateScale(12)},
    ],
    [fullHeaderHeight],
  );

  return (
    <Box flex={1} backgroundColor="surfaceBackground">
      {/* Scrollable card list — scrolls under the absolute header */}
      <Animated.FlatList
        data={displayItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={listContentStyle}
        ItemSeparatorComponent={ListSeparator}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        maxToRenderPerBatch={15}
        windowSize={10}
        removeClippedSubviews={true}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListEmptyComponent={
          isSearching ? (
            <Box>
              {SKELETON_KEYS.map(i => (
                <ListItemSkeleton key={i} />
              ))}
            </Box>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <Box>
              <ListItemSkeleton />
              <ListItemSkeleton />
            </Box>
          ) : null
        }
      />

      {/* Absolute collapsible header — only the search bar remains when collapsed */}
      <Animated.View
        style={[
          styles.header,
          {paddingTop: insets.top},
          headerAnimatedStyle,
        ]}>
        {/* Search bar (static) — filters the list directly, no suggestions popup */}
        <Box
          flexDirection="row"
          alignItems="center"
          marginHorizontal="m"
          marginTop="s"
          paddingHorizontal="m"
          borderRadius="full"
          height={moderateScale(48)}
          style={styles.searchBar}>
          <Icon source="magnify" size={moderateScale(20)} color="textSecondary" />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor="#898d8f"
            style={styles.searchInput}
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => onSearchChange('')}
              activeOpacity={0.7}
              hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
              <Icon source="close-circle" size={moderateScale(18)} color="textSecondary" />
            </TouchableOpacity>
          )}
        </Box>

        {/* Collapsible: segmented control + filter */}
        <Animated.View style={controlsAnimatedStyle}>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal="m"
            paddingTop="s"
            paddingBottom="s">
            <MapSegmentedControl
              activeMode={viewMode}
              onModeChange={onModeChange}
              embedded
            />
            <MapFab
              svgIcon={FilterIcon}
              size="small"
              onPress={onFilterPress}
              badge={filterCount}
            />
          </Box>
        </Animated.View>

        {/* Collapsible: count + sort info */}
        <Animated.View style={subtitleAnimatedStyle}>
          <Box paddingHorizontal="m" paddingBottom="s">
            <Text
              variant="bodyMedium"
              color="textSecondary"
              style={styles.subtitle}>
              {t(userLocation ? 'listSubtitle' : 'listSubtitleNoLocation', {count: searchData?.pages?.[0]?.found ?? displayItems.length})}
            </Text>
          </Box>
        </Animated.View>
      </Animated.View>
    </Box>
  );
}

function ListSeparator() {
  return <Box height={moderateScale(16)} />;
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: palette.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.gray100,
    overflow: 'hidden',
  },
  searchBar: {
    backgroundColor: palette.white,
    shadowColor: palette.gray900,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    fontFamily: fonts.regular,
    color: palette.black,
    padding: 0,
  },
  listContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(160),
  },
  subtitle: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14 * 1.5),
  },
});
