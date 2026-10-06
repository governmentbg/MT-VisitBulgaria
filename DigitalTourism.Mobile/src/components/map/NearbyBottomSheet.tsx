import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, ScrollView, FlatList, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {Box, Text, Icon} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {bottomSheetStyles} from '../../theme/bottomSheet';
import {useTranslation} from 'react-i18next';
import {FilterChip, ClearFilterChip} from '../filters';
import {useBottomSheetBackdrop} from '../../hooks/useBottomSheetBackdrop';
import {DetailNearbyCard} from '../detail';
import type {MapItem} from '../../types/map';

type CategoryFilter =
  | 'all'
  | 'attractions'
  | 'hotels'
  | 'restaurants'
  | 'activities';

const CATEGORY_FILTERS: Array<{
  key: CategoryFilter;
  emoji: string;
  labelKey: string;
}> = [
  {key: 'attractions', emoji: '🏛️', labelKey: 'filterLabels.attractions'},
  {key: 'hotels', emoji: '🏨', labelKey: 'filterLabels.hotels'},
  {key: 'restaurants', emoji: '🍽️', labelKey: 'filterLabels.restaurants'},
  {key: 'activities', emoji: '🏃', labelKey: 'filterLabels.activities'},
];

// Fixed item height for getItemLayout optimization
const ITEM_HEIGHT = moderateScale(74 + 16); // card height + padding
const SEPARATOR_HEIGHT = moderateScale(12);

interface NearbyBottomSheetProps {
  visible: boolean;
  items: MapItem[];
  onClose: () => void;
  onItemPress: (item: MapItem) => void;
}

export function NearbyBottomSheet({
  visible,
  items,
  onClose,
  onItemPress,
}: NearbyBottomSheetProps) {
  const {t} = useTranslation('map');
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const snapPoints = useMemo(() => ['85%'], []);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items;
    return items.filter(item => item.category.type === activeFilter);
  }, [items, activeFilter]);

  const renderItem = useCallback(
    ({item}: {item: MapItem}) => (
      <DetailNearbyCard
        item={{
          id: item.id,
          name: item.name,
          images: item.images,
          category: item.category,
          distanceMeters: item.distanceMeters,
        }}
        onPress={() => onItemPress(item)}
        cardStyle="elevated"
      />
    ),
    [onItemPress],
  );

  const keyExtractor = useCallback((item: MapItem) => item.id, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<MapItem> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: (ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
      index,
    }),
    [],
  );

  const handleCategoryToggle = useCallback((key: CategoryFilter) => {
    setActiveFilter(prev => (prev === key ? 'all' : key));
  }, []);

  const handleCategoryClear = useCallback(() => {
    setActiveFilter('all');
  }, []);

  const renderBackdrop = useBottomSheetBackdrop();

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={false}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}>
      <View style={styles.container}>
        {/* Sticky header — does NOT scroll */}
        <Box>
          {/* Title + close */}
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
            paddingHorizontal="m"
            paddingTop="xs">
            <Box flex={1}>
              <Text fontFamily={fonts.bold} style={styles.title}>
                {t('nearbyPlaces')}
              </Text>
              <Text style={styles.subtitle}>
                {t('nearbySubtitle', {
                  count: filteredItems.length,
                })}
              </Text>
            </Box>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Box
                width={moderateScale(32)}
                height={moderateScale(32)}
                borderRadius="full"
                alignItems="center"
                justifyContent="center">
                <Icon
                  source="close"
                  size={moderateScale(16)}
                  color="textPrimary"
                />
              </Box>
            </TouchableOpacity>
          </Box>

          {/* Divider */}
          <Box height={1} backgroundColor="divider" marginTop="m" marginBottom="m" />

          {/* Category filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}>
            {CATEGORY_FILTERS.map(filter => (
              <CategoryFilterChip
                key={filter.key}
                filter={filter}
                label={t(filter.labelKey)}
                isActive={activeFilter === filter.key}
                onToggle={handleCategoryToggle}
              />
            ))}
            {activeFilter !== 'all' && (
              <ClearFilterChip onPress={handleCategoryClear} />
            )}
          </ScrollView>
        </Box>

        {/* Scrollable item list — only this part scrolls */}
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.itemList}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews
          nestedScrollEnabled
        />
      </View>
    </BottomSheetModal>
  );
}

/* --- Sub-components --- */

const CategoryFilterChip = React.memo(function CategoryFilterChip({
  filter,
  label,
  isActive,
  onToggle,
}: {
  filter: {key: CategoryFilter; emoji: string};
  label: string;
  isActive: boolean;
  onToggle: (key: CategoryFilter) => void;
}) {
  const handlePress = useCallback(() => onToggle(filter.key), [filter.key, onToggle]);
  return (
    <FilterChip
      emoji={filter.emoji}
      label={label}
      isActive={isActive}
      onPress={handlePress}
    />
  );
});

function ItemSeparator() {
  return <Box height={moderateScale(12)} />;
}

/* --- Styles --- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheetBackground: bottomSheetStyles.sheetBackground,
  handleIndicator: bottomSheetStyles.handleIndicator,
  title: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
    color: palette.heading,
  },
  subtitle: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14 * 1.5),
    color: palette.gray600,
    marginTop: moderateScale(4),
  },
  filterList: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(12),
  },
  itemList: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(40),
  },
});
