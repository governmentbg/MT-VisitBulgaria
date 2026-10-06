import React from 'react';
import {StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Box, Text, Icon} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';
import type {SearchFilters} from '../../services/api/types/searchTypes';

interface AppliedFilterPillsProps {
  filters: SearchFilters;
  onRemove: (key: keyof SearchFilters, value: string) => void;
  onClearAll: () => void;
}

export function AppliedFilterPills({filters, onRemove, onClearAll}: AppliedFilterPillsProps) {
  const {t} = useTranslation('common');

  // Collect all active filter values
  const pills: Array<{key: keyof SearchFilters; value: string}> = [];
  const filterKeys: Array<keyof SearchFilters> = [
    'categories', 'city', 'starRating', 'amenities', 'cuisineType',
    'dietaryOptions', 'difficultyLevel', 'seasonality', 'organizer',
  ];

  for (const key of filterKeys) {
    const values = filters[key];
    if (Array.isArray(values)) {
      for (const value of values) {
        pills.push({key, value: String(value)});
      }
    }
  }

  if (pills.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {pills.map((pill, i) => (
        <TouchableOpacity
          key={`${pill.key}-${pill.value}-${i}`}
          onPress={() => onRemove(pill.key, pill.value)}
          activeOpacity={0.7}>
          <Box flexDirection="row" alignItems="center" style={styles.pill}>
            <Text style={styles.pillText} numberOfLines={1}>{pill.value}</Text>
            <Icon source="close" size={moderateScale(14)} color={palette.green800} />
          </Box>
        </TouchableOpacity>
      ))}
      {pills.length >= 2 && (
        <TouchableOpacity onPress={onClearAll} activeOpacity={0.7}>
          <Box style={styles.clearPill}>
            <Text style={styles.clearText}>{t('filters.clearAll', {defaultValue: 'Clear all'})}</Text>
          </Box>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {paddingHorizontal: moderateScale(16), gap: moderateScale(8), paddingVertical: moderateScale(8)},
  pill: {
    backgroundColor: palette.green50,
    borderRadius: 20,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    gap: moderateScale(4),
  },
  pillText: {fontSize: moderateScale(13), color: palette.green800, fontWeight: '600', maxWidth: moderateScale(120)},
  clearPill: {
    backgroundColor: 'rgba(219,52,11,0.1)',
    borderRadius: 20,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
  },
  clearText: {fontSize: moderateScale(13), color: palette.dangerDark, fontWeight: '600'},
});
