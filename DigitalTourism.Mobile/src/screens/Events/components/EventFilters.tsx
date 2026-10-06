import React, {useMemo} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {EventStatus} from '../../../models/Event';
import type {FacetValue} from '../../../services/api/types/searchTypes';
import {moderateScale} from '../../../theme/scaling';
import {useTranslation} from 'react-i18next';
import {FilterChip} from '../../../components/filters';

type ChipValue = EventStatus | string;

interface ChipOption {
  label: string;
  value: ChipValue;
  type: 'status' | 'category';
  count?: number;
}

interface EventFiltersProps {
  selectedChips: ChipValue[];
  onChipToggle: (value: ChipValue) => void;
  /** Facet counts keyed by server field name */
  facets?: Record<string, FacetValue[]>;
}

/**
 * Horizontal scrollable category/status chips for events list.
 * Status chips are hardcoded; category chips come from the server's
 * `categories.title` facet counts.
 */
export function EventCategoryChips({
  selectedChips,
  onChipToggle,
  facets = {},
}: EventFiltersProps) {
  const {t} = useTranslation('events');

  const chipOptions = useMemo((): ChipOption[] => {
    const statusChips: ChipOption[] = [
      {label: t('status.active'), value: EventStatus.ACTIVE, type: 'status'},
      {label: t('status.upcoming'), value: EventStatus.UPCOMING, type: 'status'},
      {label: t('status.past'), value: EventStatus.PAST, type: 'status'},
    ];

    const categoryCounts = facets['categories.title'] ?? [];
    const categoryChips: ChipOption[] = categoryCounts.map(fc => ({
      label: fc.value,
      value: fc.value,
      type: 'category' as const,
      count: fc.count,
    }));

    return [...statusChips, ...categoryChips];
  }, [t, facets]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {chipOptions.map(option => {
        const isSelected = selectedChips.includes(option.value);
        return (
          <FilterChip
            key={option.value}
            label={option.label}
            isActive={isSelected}
            count={option.count}
            onPress={() => onChipToggle(option.value)}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(8),
  },
});
