import React, {useState, useCallback, useMemo, useEffect, useRef} from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {SafeAreaView, Text, Icon} from '../../design';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../theme';
import {EventCategoryChips} from './components/EventFilters';
import {EventsList} from './components/EventsList';
import {MapListFiltersModal, emptyMapListFilters} from '../../components/map/MapListFiltersModal';
import type {MapListFilters} from '../../components/map/MapListFiltersModal';
import {useSearchFacets} from '../../hooks/queries/useSearch';
import {useInfiniteSearch} from '../../hooks/queries/useInfiniteSearch';
import {EventStatus, Event} from '../../models/Event';
import type {
  SearchFilters,
} from '../../services/api/types/searchTypes';
import {useNavigation} from '@react-navigation/native';
import type {RootStackParamList} from '../../navigation/types';
import {hitToEvent, STATUS_VALUES} from '../../utils/eventTransforms';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {
  styles,
  TITLE_SECTION_HEIGHT,
  CHIPS_SECTION_HEIGHT,
  HEADER_PADDING_BOTTOM_EXPANDED,
  HEADER_PADDING_BOTTOM_COLLAPSED,
  FULL_HEADER_HEIGHT,
  COLLAPSED_HEADER_HEIGHT,
} from './EventsScreen.styles';
import {useFavouriteToggleForList} from '../../hooks/useFavouriteToggle';
import {useAuth} from '../../contexts/AuthContext';
import {useUserLocation} from '../../hooks/useUserLocation';
import {useCollapsibleHeader} from '../../hooks/useCollapsibleHeader';
import {HeaderProfileButton} from '../../components/shared/HeaderProfileButton';
import {analytics} from '../../services/analytics';
import FilterIcon from '../../assets/icons/filter.svg';

type EventsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Events screen with collapsible animated header.
 *
 * The header is position:absolute so its height changes do NOT affect
 * the FlatList layout — this prevents the scroll-position feedback loop.
 * The list has fixed paddingTop equal to the full header height.
 */
export function EventsScreen() {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const theme = useTheme<Theme>();
  const {t} = useTranslation('events');

  const {userLocation, getCurrentPosition} = useUserLocation();

  // Request location on mount (if permission already granted)
  useEffect(() => {
    getCurrentPosition().catch(err => {
      if (__DEV__) console.warn('[EventsScreen] getCurrentPosition failed:', err);
    });
  }, [getCurrentPosition]);

  // Filter state
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] =
    useState<MapListFilters>(emptyMapListFilters);

  // Favorites
  const {isAuthenticated} = useAuth();
  const {
    toggle: toggleFavourite,
    isFavourited,
    confirmDialog: favouriteConfirmDialog,
  } = useFavouriteToggleForList('events');

  // --- Collapsible header animation ---
  const listRef = useRef<Animated.FlatList<any>>(null);

  const {
    scrollHandler,
    headerAnimatedStyle,
    titleAnimatedStyle,
    chipsAnimatedStyle,
    resetScroll,
  } = useCollapsibleHeader({
    fullHeight: FULL_HEADER_HEIGHT,
    collapsedHeight: COLLAPSED_HEADER_HEIGHT,
    titleSectionHeight: TITLE_SECTION_HEIGHT,
    chipsSectionHeight: CHIPS_SECTION_HEIGHT,
    paddingExpanded: HEADER_PADDING_BOTTOM_EXPANDED,
    paddingCollapsed: HEADER_PADDING_BOTTOM_COLLAPSED,
  });

  // --- Search filters ---
  const statusFilter = useMemo(() => {
    const statusChips = selectedChips.filter(
      c =>
        c === EventStatus.ACTIVE ||
        c === EventStatus.UPCOMING ||
        c === EventStatus.PAST,
    );
    return statusChips.length === 1
      ? (statusChips[0] as EventStatus)
      : undefined;
  }, [selectedChips]);

  // Category chips selected from the horizontal chip bar
  const selectedCategoryChips = useMemo(() => {
    return selectedChips.filter(
      c =>
        c !== EventStatus.ACTIVE &&
        c !== EventStatus.UPCOMING &&
        c !== EventStatus.PAST,
    );
  }, [selectedChips]);

  // Merge chip-bar categories + modal filters into SearchFilters
  const searchFilters = useMemo((): SearchFilters => {
    const allCategories = [
      ...selectedCategoryChips,
      ...advancedFilters.categories,
    ];
    const uniqueCategories = [...new Set(allCategories)];

    const f: SearchFilters = {type: ['event']};
    if (uniqueCategories.length > 0) f.categories = uniqueCategories;
    if (advancedFilters.cities.length > 0) f.city = advancedFilters.cities;
    if (advancedFilters.municipality.length > 0) f.municipality = advancedFilters.municipality;
    if (advancedFilters.region.length > 0) f.region = advancedFilters.region;
    if (advancedFilters.tags.length > 0) f.tags = advancedFilters.tags;
    if (advancedFilters.organizer.length > 0) f.organizer = advancedFilters.organizer;
    if (advancedFilters.seasonality.length > 0) f.seasonality = advancedFilters.seasonality;
    if (advancedFilters.amenities.length > 0) f.amenities = advancedFilters.amenities;
    if (advancedFilters.starRating.length > 0) f.starRating = advancedFilters.starRating.map(Number);
    if (advancedFilters.cuisineType.length > 0) f.cuisineType = advancedFilters.cuisineType;
    if (advancedFilters.dietaryOptions.length > 0) f.dietaryOptions = advancedFilters.dietaryOptions;
    if (advancedFilters.difficultyLevel.length > 0) f.difficultyLevel = advancedFilters.difficultyLevel;
    // Exclude past events unless "Past" chip is explicitly selected.
    // Typesense stores period.endDate in milliseconds, so pass ms.
    if (statusFilter !== EventStatus.PAST) {
      f.dateEndAfter = Date.now();
    }
    return f;
  }, [selectedCategoryChips, advancedFilters, statusFilter]);

  // Reset scroll position & expand header when filters change
  useEffect(() => {
    resetScroll(listRef);
  }, [searchFilters, resetScroll]);

  // Typesense infinite search
  const {
    data: infiniteData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteSearch({
    query: searchText.trim() || undefined,
    filters: searchFilters,
    perPage: 20,
    sortBy: 'period.startDate:asc',
  });

  // Facets for filter UI — use same filters as the list (including dateEndAfter)
  const {data: facetsResult} = useSearchFacets(searchFilters);

  const facets = useMemo(
    () => facetsResult?.facets ?? {},
    [facetsResult],
  );

  // Flatten all pages into a single list of events
  const allEvents = useMemo(() => {
    if (!infiniteData?.pages) return [];
    return infiniteData.pages.flatMap(page =>
      page.hits.map(hit => hitToEvent(hit)),
    );
  }, [infiniteData]);

  // Client-side status filter (status is computed from dates, not a Typesense field)
  const filteredEvents = useMemo(() => {
    if (statusFilter) return allEvents.filter(e => e.status === statusFilter);
    // Default: exclude past events (active + upcoming only)
    return allEvents.filter(e => e.status !== EventStatus.PAST);
  }, [allEvents, statusFilter]);

  // Track search queries in GA4
  const firstPageFound = infiniteData?.pages[0]?.found;
  useEffect(() => {
    if (firstPageFound !== undefined && searchText) {
      analytics.trackSearch(searchText, firstPageFound);
    }
  }, [firstPageFound, searchText]);

  const handleEventPress = useCallback(
    (event: Event) => {
      navigation.navigate('EventDetail', {id: event.id});
    },
    [navigation],
  );

  const handleFavoritePress = useCallback((event: Event) => {
    toggleFavourite(event.id, event.name);
  }, [toggleFavourite]);

  const handleChipToggle = useCallback((value: string) => {
    setSelectedChips(prev => {
      if (STATUS_VALUES.has(value)) {
        // Status chips are exclusive (radio) — deselect if already selected, otherwise replace
        const withoutStatus = prev.filter(c => !STATUS_VALUES.has(c));
        return prev.includes(value) ? withoutStatus : [...withoutStatus, value];
      }
      // Category chips are multi-select (toggle)
      return prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value];
    });
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const activeFilterCount = useMemo(() => {
    return Object.values(advancedFilters).reduce((sum, arr) => sum + arr.length, 0);
  }, [advancedFilters]);

  return (
    <SafeAreaView flex={1} backgroundColor="mainBackground">
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* List — fills entire area, scrolls under the header */}
        <EventsList
          listRef={listRef}
          events={filteredEvents}
          onEventPress={handleEventPress}
          onFavoritePress={isAuthenticated ? handleFavoritePress : undefined}
          isFavourited={isFavourited}
          isLoading={isLoading}
          isError={isError}
          onRefresh={handleRefresh}
          refreshing={false}
          onLoadMore={handleLoadMore}
          isLoadingMore={isFetchingNextPage}
          onScroll={scrollHandler}
          contentPaddingTop={FULL_HEADER_HEIGHT}
          userLocation={userLocation}
        />

        {/* Header — absolute positioned, height animates without affecting list layout */}
        <Animated.View
          style={[
            styles.headerContainer,
            {paddingHorizontal: theme.spacing.m},
            headerAnimatedStyle,
          ]}>
          {/* Collapsible: Title & Subtitle + profile button */}
          <Animated.View
            style={[styles.titleSection, titleAnimatedStyle]}>
            <View style={styles.titleRow}>
              <View style={styles.titleTextBlock}>
                <Text style={styles.headerTitle}>{t('title')}</Text>
                <Text style={styles.headerSubtitle}>{t('subtitle')}</Text>
              </View>
              <HeaderProfileButton />
            </View>
          </Animated.View>

          {/* Static: Search Bar + Filter Button */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Icon
                source="magnify"
                size={moderateScale(20)}
                color={palette.gray600}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={t('searchPlaceholder')}
                placeholderTextColor={palette.gray400}
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchText('')}
                  activeOpacity={0.7}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Icon source="close-circle" size={moderateScale(18)} color={palette.gray400} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setShowFiltersModal(true)}
              activeOpacity={0.7}
              accessibilityLabel={t('filters.title')}
              style={styles.filterButtonTouch}>
              <View style={styles.filterButton}>
                <FilterIcon
                  width={moderateScale(16)}
                  height={moderateScale(16)}
                />
              </View>
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>
                    {activeFilterCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Collapsible: Category Chips */}
          <Animated.View style={[styles.chipsContainer, chipsAnimatedStyle]}>
            <EventCategoryChips
              selectedChips={selectedChips}
              onChipToggle={handleChipToggle}
              facets={facets}
            />
          </Animated.View>
        </Animated.View>
      </View>

      {/* Filters Modal */}
      <MapListFiltersModal
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        facets={facets}
      />

      {favouriteConfirmDialog}
    </SafeAreaView>
  );
}

