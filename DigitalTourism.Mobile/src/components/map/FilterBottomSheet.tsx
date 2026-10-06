import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, type DimensionValue} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {bottomSheetStyles} from '../../theme/bottomSheet';
import {useTranslation} from 'react-i18next';
import {useSearchFacets} from '../../hooks/queries/useSearch';
import {TYPE_EMOJI} from '../../constants';
import {useBottomSheetBackdrop} from '../../hooks/useBottomSheetBackdrop';

export type FilterCategory = 'attraction' | 'activity' | 'restaurant' | 'hotel' | 'event';

const FILTER_OPTIONS: Array<{
  key: FilterCategory;
  emoji: string;
  labelKey: string;
}> = [
  {key: 'attraction', emoji: TYPE_EMOJI.attraction, labelKey: 'attractions'},
  {key: 'activity', emoji: TYPE_EMOJI.activity, labelKey: 'activities'},
  {key: 'restaurant', emoji: TYPE_EMOJI.restaurant, labelKey: 'restaurants'},
  {key: 'hotel', emoji: TYPE_EMOJI.hotel, labelKey: 'hotels'},
  {key: 'event', emoji: TYPE_EMOJI.event, labelKey: 'events'},
];

interface FilterBottomSheetProps {
  visible: boolean;
  /** Optional local counts — used as fallback when facets are loading */
  counts?: Partial<Record<FilterCategory, number>>;
  activeFilters: Set<FilterCategory>;
  onApply: (filters: Set<FilterCategory>) => void;
  onClose: () => void;
}

/**
 * Filter bottom sheet for the map screen.
 * Shows a 2x2 grid of category cards with emoji, label, and nearby count.
 * Selected cards get teal bg/border. "Apply Filters" button at bottom.
 */
export function FilterBottomSheet({
  visible,
  counts = {} as Partial<Record<FilterCategory, number>>,
  activeFilters,
  onApply,
  onClose,
}: FilterBottomSheetProps) {
  const {t} = useTranslation('map');
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selected, setSelected] = useState<Set<FilterCategory>>(new Set(activeFilters));

  // Fetch facet counts from the API Service
  const {data: facetData} = useSearchFacets();

  // Extract type facet counts — prefer server facets, fall back to props
  const facetCounts = useMemo(() => {
    const result: Partial<Record<FilterCategory, number>> = {...counts};
    const typeFacet = facetData?.facets?.type;
    if (typeFacet) {
      for (const entry of typeFacet) {
        const key = entry.value as FilterCategory;
        result[key] = entry.count;
      }
    }
    return result;
  }, [facetData, counts]);

  // Sync local state when sheet opens
  useEffect(() => {
    if (visible) {
      setSelected(new Set(activeFilters));
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, activeFilters]);

  const hasSelection = selected.size > 0;

  const toggleFilter = useCallback((key: FilterCategory) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleClear = useCallback(() => {
    setSelected(new Set());
  }, []);

  const handleApply = useCallback(() => {
    onApply(selected);
    onClose();
  }, [selected, onApply, onClose]);

  const renderBackdrop = useBottomSheetBackdrop();

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing
      enablePanDownToClose={false}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={false}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetView style={styles.content}>
        {/* Header: title + clear */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="m">
          <Text fontFamily={fonts.bold} style={styles.title}>
            {t('filters')}
          </Text>
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
            <Box paddingHorizontal="m" paddingVertical="s">
              <Text
                fontFamily={fonts.bold}
                style={[
                  styles.clearText,
                  hasSelection ? styles.clearActive : styles.clearDisabled,
                ]}>
                {t('clear')}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>

        {/* Filter grid: even rows */}
        <Box paddingHorizontal="m" marginTop="m" gap="s">
          <Box flexDirection="row" gap="s" flexWrap="wrap">
            {FILTER_OPTIONS.map(opt => (
              <FilterCard
                key={opt.key}
                emoji={opt.emoji}
                label={t(`filterLabels.${opt.labelKey}`)}
                count={facetCounts[opt.key]}
                isSelected={selected.has(opt.key)}
                filterKey={opt.key}
                onToggle={toggleFilter}
              />
            ))}
          </Box>
        </Box>

        {/* Apply button */}
        <Box paddingHorizontal="m" marginTop="m" marginBottom="l">
          <TouchableOpacity
            onPress={handleApply}
            activeOpacity={0.8}
            style={styles.applyButton}>
            <Text fontFamily={fonts.bold} style={styles.applyText}>
              {t('applyFilters')}
            </Text>
          </TouchableOpacity>
        </Box>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

/* --- FilterCard --- */

const FilterCard = React.memo(function FilterCard({
  emoji,
  label,
  count,
  isSelected,
  filterKey,
  onToggle,
}: {
  emoji: string;
  label: string;
  count?: number;
  isSelected: boolean;
  filterKey: FilterCategory;
  onToggle: (key: FilterCategory) => void;
}) {
  const handlePress = useCallback(() => onToggle(filterKey), [filterKey, onToggle]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.card,
        isSelected ? styles.cardSelected : styles.cardDefault,
      ]}
      accessibilityLabel={label}
      accessibilityRole="checkbox"
      accessibilityState={{checked: isSelected}}>
      <Text style={styles.cardEmoji}>{emoji}</Text>
      <Text fontFamily={fonts.bold} style={styles.cardLabel} numberOfLines={1}>
        {label}
      </Text>
      {count != null && (
        <Text style={styles.cardCount}>
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
});

/* --- Styles --- */

const styles = StyleSheet.create({
  sheetBackground: bottomSheetStyles.sheetBackground,
  handleIndicator: bottomSheetStyles.handleIndicator,
  content: {
    paddingTop: moderateScale(8),
  },
  title: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
    color: palette.heading,
  },
  clearText: {
    fontSize: moderateScale(16),
  },
  clearActive: {
    color: palette.green700,
  },
  clearDisabled: {
    color: palette.gray400,
  },
  card: {
    width: '30%' as DimensionValue,
    flexGrow: 1,
    height: moderateScale(100),
    borderRadius: 12,
    borderWidth: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(8),
    gap: moderateScale(4),
    marginBottom: moderateScale(4),
  },
  cardDefault: {
    backgroundColor: palette.white,
    borderColor: palette.gray100,
  },
  cardSelected: {
    backgroundColor: palette.green50,
    borderColor: palette.green500,
  },
  cardEmoji: {
    fontSize: moderateScale(28),
    lineHeight: moderateScale(32),
  },
  cardLabel: {
    fontSize: moderateScale(12),
    color: palette.heading,
    textAlign: 'center',
  },
  cardCount: {
    fontSize: moderateScale(12),
    color: palette.gray600,
    textAlign: 'center',
  },
  applyButton: {
    height: moderateScale(48),
    borderRadius: 48,
    backgroundColor: palette.green700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: moderateScale(16),
    color: palette.white,
  },
});
