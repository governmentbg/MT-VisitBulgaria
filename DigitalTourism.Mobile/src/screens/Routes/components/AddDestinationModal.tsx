import React, {useState, useMemo, useCallback, useRef, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  TextInput as RNTextInput,
} from 'react-native';
import {BottomSheetModal, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useBottomSheetBackdrop} from '../../../hooks/useBottomSheetBackdrop';
import {Box, Text, Icon, Image, ResizeMode} from '../../../design';
import {useTheme} from '@shopify/restyle';
import {Theme, theme as themeConfig} from '../../../theme';
import {fonts} from '../../../theme/fonts';
import {moderateScale} from '../../../theme/scaling';
import {useTranslation} from 'react-i18next';
import {palette} from '../../../theme/palette';
import {useInfiniteSearch} from '../../../hooks/queries/useInfiniteSearch';
import {resolveMediaUrl} from '../../../services/api/transforms/payloadHelpers';
import {stripTypesenseId} from '../../../utils/searchHitTransforms';
import type {SearchFilters, ExperienceSearchResult} from '../../../services/api/types/searchTypes';
import {useAddRouteStop} from '../../../hooks/mutations/useRouteItems';
import type {RouteDay, RouteExperienceType} from '../../../models/Route';
import {EXPERIENCE_TYPE_EMOJI} from '../../../models/Route';

interface AddDestinationModalProps {
  visible: boolean;
  onClose: () => void;
  routeId: number;
  days: RouteDay[];
}

type FilterCategory = RouteExperienceType;

const FILTER_OPTIONS: Array<{
  key: FilterCategory;
  emoji: string;
  labelKey: string;
}> = [
  {key: 'attractions', emoji: EXPERIENCE_TYPE_EMOJI.attractions, labelKey: 'typeAttractions'},
  {key: 'events', emoji: EXPERIENCE_TYPE_EMOJI.events, labelKey: 'typeEvents'},
  {key: 'hotels', emoji: EXPERIENCE_TYPE_EMOJI.hotels, labelKey: 'typeHotels'},
  {key: 'restaurants', emoji: EXPERIENCE_TYPE_EMOJI.restaurants, labelKey: 'typeRestaurants'},
  {key: 'activities', emoji: EXPERIENCE_TYPE_EMOJI.activities, labelKey: 'typeActivities'},
];

interface SearchableItem {
  id: string;
  name: string;
  image?: string;
  type: FilterCategory;
  typeLabel: string;
}

/**
 * Modal for adding destinations/stops to a route.
 * Shows a searchable, filterable list of all experience types
 * with day-selector chips and an add button per item.
 */
export function AddDestinationModal({
  visible,
  onClose,
  routeId,
  days,
}: AddDestinationModalProps) {
  const theme = useTheme<Theme>();
  const {t} = useTranslation('routes');

  // State
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory | null>(null);
  const [addingItemId, setAddingItemId] = useState<string | null>(null);

  const addRouteStop = useAddRouteStop();

  // Build Typesense filters from active filter
  const searchFilters = useMemo((): SearchFilters | undefined => {
    if (!activeFilter) return undefined;
    // Map plural RouteExperienceType to singular Typesense type
    const typeMap: Record<string, string> = {
      attractions: 'attraction',
      events: 'event',
      hotels: 'hotel',
      restaurants: 'restaurant',
      activities: 'activity',
    };
    return {type: [typeMap[activeFilter] || activeFilter]};
  }, [activeFilter]);

  const {
    data: searchData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearch({
    query: searchQuery.trim().length >= 2 ? searchQuery.trim() : '*',
    filters: searchFilters,
    perPage: 30,
  });

  // Transform search hits to SearchableItem list
  const displayItems = useMemo((): SearchableItem[] => {
    if (!searchData?.pages) return [];
    return searchData.pages.flatMap(page =>
      page.hits.map((hit: ExperienceSearchResult) => {
        const numericId = stripTypesenseId(String(hit.id));
        // Map singular type to plural for RouteExperienceType
        const PLURAL_MAP: Record<string, string> = {
          attraction: 'attractions',
          event: 'events',
          hotel: 'hotels',
          restaurant: 'restaurants',
          activity: 'activities',
        };
        const pluralType = PLURAL_MAP[hit.type] || hit.type;
        return {
          id: `${pluralType}_${numericId}`,
          name: hit.title,
          image: hit.heroImage?.url ? resolveMediaUrl(hit.heroImage.url) : undefined,
          type: pluralType as FilterCategory,
          typeLabel: t(`type${pluralType.charAt(0).toUpperCase() + pluralType.slice(1)}`, {defaultValue: pluralType}),
        };
      }),
    );
  }, [searchData, t]);

  const handleAddItem = useCallback(
    async (item: SearchableItem) => {
      // Extract numeric ID from composite key (e.g. "attractions_123" -> 123)
      const numericId = parseInt(item.id.split('_')[1], 10);
      if (isNaN(numericId)) {
        console.warn('[AddDestination] Invalid item ID format:', item.id);
        return;
      }

      setAddingItemId(item.id);
      try {
        await addRouteStop.mutateAsync({
          routeId,
          dayIndex: selectedDayIndex,
          experienceType: item.type,
          experienceId: numericId,
        });
      } catch (error) {
        console.error('[AddDestination] Failed to add:', error);
      } finally {
        setAddingItemId(null);
      }
    },
    [addRouteStop, routeId, selectedDayIndex],
  );

  const toggleFilter = useCallback(
    (key: FilterCategory) => {
      setActiveFilter(prev => (prev === key ? null : key));
    },
    [],
  );

  const renderItem = useCallback(
    ({item}: {item: SearchableItem}) => {
      const isAdding = addingItemId === item.id;

      return (
        <View
          style={[
            styles.resultItem,
            {backgroundColor: theme.colors.mainBackground},
          ]}>
          {item.image ? (
            <Image
              source={{uri: item.image}}
              style={styles.resultImage}
              resizeMode={ResizeMode.cover}
            />
          ) : (
            <View
              style={[
                styles.resultImage,
                styles.resultImagePlaceholder,
                {backgroundColor: theme.colors.surfaceBackground},
              ]}>
              <Icon source="image-outline" size="s" color="textTertiary" />
            </View>
          )}

          <Box flex={1} marginLeft="s">
            <Text
              variant="subtitle"
              numberOfLines={1}
>
              {item.name}
            </Text>
            <Text variant="small" color="textSecondary" numberOfLines={1}>
              {item.typeLabel}
            </Text>
          </Box>

          {isAdding ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={styles.addButton}
            />
          ) : (
            <TouchableOpacity
              onPress={() => handleAddItem(item)}
              activeOpacity={0.7}
              accessibilityLabel={t('addDestination', {defaultValue: 'Add'})}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Icon source="plus-circle-outline" size="m" color="primary" />
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [addingItemId, theme.colors, handleAddItem, t],
  );

  const renderEmptyState = useCallback(
    () => (
      <Box padding="xl" alignItems="center">
        <Icon
          source="map-search-outline"
          size="xl"
          color="textSecondary"
          marginBottom="m"
        />
        <Text variant="subtitle" textAlign="center" marginBottom="s">
          {t('searchDestinations', {defaultValue: 'Search destinations'})}
        </Text>
      </Box>
    ),
    [t],
  );

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['90%'], []);
  // enableDynamicSizing is off — the sheet stays at 90% and won't collapse

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useBottomSheetBackdrop('close', 0.5);

  const renderDayChip = useCallback(
    ({item, index}: {item: RouteDay; index: number}) => {
      const isSelected = selectedDayIndex === index;
      return (
        <TouchableOpacity
          onPress={() => setSelectedDayIndex(index)}
          activeOpacity={0.7}
          style={[
            styles.dayChip,
            isSelected
              ? styles.dayChipSelected
              : styles.dayChipDefault,
          ]}>
          <Text
            fontFamily={fonts.bold}
            style={[
              styles.dayChipText,
              isSelected
                ? styles.dayChipTextSelected
                : styles.dayChipTextDefault,
            ]}>
            {t('day', {number: item.dayNumber, defaultValue: `Day ${item.dayNumber}`})}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedDayIndex, t],
  );

  const renderFilterChip = useCallback(
    ({item}: {item: typeof FILTER_OPTIONS[number]}) => {
      const isSelected = activeFilter === item.key;
      return (
        <TouchableOpacity
          onPress={() => toggleFilter(item.key)}
          activeOpacity={0.7}
          style={[
            styles.filterChip,
            isSelected
              ? styles.filterChipSelected
              : styles.filterChipDefault,
          ]}>
          <Text style={styles.filterEmoji}>{item.emoji}</Text>
          <Text
            fontFamily={fonts.medium}
            style={[
              styles.filterChipText,
              isSelected
                ? styles.filterChipTextSelected
                : styles.filterChipTextDefault,
            ]}>
            {t(item.labelKey)}
          </Text>
        </TouchableOpacity>
      );
    },
    [activeFilter, toggleFilter, t],
  );

  const dayKeyExtractor = useCallback((item: RouteDay) => String(item.dayNumber), []);
  const filterKeyExtractor = useCallback((item: typeof FILTER_OPTIONS[number]) => item.key, []);

  const renderListHeader = useCallback(() => (
    <>
      {/* Day selector chips */}
      <Box paddingHorizontal="m" paddingVertical="s">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={days}
          keyExtractor={dayKeyExtractor}
          renderItem={renderDayChip}
        />
      </Box>

      {/* Search bar */}
      <Box
        flexDirection="row"
        alignItems="center"
        marginHorizontal="m"
        marginBottom="s"
        paddingHorizontal="s"
        paddingVertical="xs"
        borderRadius="l"
        style={{backgroundColor: theme.colors.surfaceBackground}}>
        <Icon source="magnify" size="s" color="textSecondary" />
        <RNTextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('searchDestinations', {defaultValue: 'Search destinations'})}
          placeholderTextColor={theme.colors.textTertiary}
          style={[
            styles.searchInput,
            {color: theme.colors.textPrimary},
          ]}
          autoCorrect={false}
          returnKeyType="search"
        />
      </Box>

      {/* Filter chips */}
      <Box paddingHorizontal="m" marginBottom="s">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_OPTIONS}
          keyExtractor={filterKeyExtractor}
          renderItem={renderFilterChip}
        />
      </Box>
    </>
  ), [days, dayKeyExtractor, renderDayChip, searchQuery, theme.colors, t, filterKeyExtractor, renderFilterChip]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{backgroundColor: theme.colors.surfaceBackground}}
      handleIndicatorStyle={styles.handleIndicator}>
      {/* Title bar */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="m"
        paddingTop="s"
        paddingBottom="m"
        borderBottomWidth={1}
        borderBottomColor="gray100">
        <Text variant="title">
          {t('addDestination', {defaultValue: 'Add destination'})}
        </Text>
        <TouchableOpacity onPress={onClose} accessibilityLabel={t('cancel', {defaultValue: 'Close'})}>
          <Icon source="close" size="m" color="textSecondary" />
        </TouchableOpacity>
      </Box>

      {/* Fixed header: day chips, search, filter chips */}
      {renderListHeader()}

      {/* Scrollable results list */}
      {isLoading ? (
        <Box padding="xl" alignItems="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Box>
      ) : (
        <BottomSheetFlatList
          data={displayItems}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <Box padding="m" alignItems="center">
                <ActivityIndicator size="small" />
              </Box>
            ) : null
          }
        />
      )}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: palette.gray400,
    width: moderateScale(40),
    height: moderateScale(4),
  },
  // Day selector chips
  dayChip: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: themeConfig.borderRadii.full,
    marginRight: moderateScale(8),
    borderWidth: 1,
  },
  dayChipSelected: {
    backgroundColor: palette.green500,
    borderColor: palette.green500,
  },
  dayChipDefault: {
    backgroundColor: palette.white,
    borderColor: palette.gray100,
  },
  dayChipText: {
    fontSize: moderateScale(13),
  },
  dayChipTextSelected: {
    color: palette.white,
  },
  dayChipTextDefault: {
    color: palette.heading,
  },

  // Filter chips
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: themeConfig.borderRadii.full,
    marginRight: moderateScale(8),
    borderWidth: 1,
  },
  filterChipSelected: {
    backgroundColor: palette.green50,
    borderColor: palette.green500,
  },
  filterChipDefault: {
    backgroundColor: palette.white,
    borderColor: palette.gray100,
  },
  filterEmoji: {
    fontSize: moderateScale(14),
    marginRight: moderateScale(4),
  },
  filterChipText: {
    fontSize: moderateScale(12),
  },
  filterChipTextSelected: {
    color: palette.green700,
  },
  filterChipTextDefault: {
    color: palette.heading,
  },

  // Search input
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: fonts.regular,
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(8),
  },

  // Result items
  listContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(24),
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(4),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.gray100,
  },
  resultItemDisabled: {
    opacity: 0.5,
  },
  resultImage: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(8),
  },
  resultImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginLeft: moderateScale(8),
  },
  textDimmed: {
    opacity: 0.5,
  },
});
