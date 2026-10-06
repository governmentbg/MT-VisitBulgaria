import React from 'react';
import {StyleSheet, TouchableOpacity, ActionSheetIOS, Platform} from 'react-native';
import {Box, Text, Icon} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';

export type SortOption = 'relevance' | 'newest' | 'title_asc' | 'title_desc';

export const SORT_TO_TYPESENSE: Record<SortOption, string> = {
  relevance: '_text_match:desc',
  newest: 'publishedAt:desc',
  title_asc: 'title:asc',
  title_desc: 'title:desc',
};

interface SortSelectorProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const SORT_OPTIONS: SortOption[] = ['relevance', 'newest', 'title_asc', 'title_desc'];

export function SortSelector({value, onChange}: SortSelectorProps) {
  const {t} = useTranslation('common');

  const labels: Record<SortOption, string> = {
    relevance: t('sort.relevance', {defaultValue: 'Relevance'}),
    newest: t('sort.newest', {defaultValue: 'Newest'}),
    title_asc: t('sort.titleAZ', {defaultValue: 'Title A-Z'}),
    title_desc: t('sort.titleZA', {defaultValue: 'Title Z-A'}),
  };

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...SORT_OPTIONS.map(o => labels[o]), t('buttons.cancel', {defaultValue: 'Cancel'})],
          cancelButtonIndex: SORT_OPTIONS.length,
        },
        (index) => {
          if (index < SORT_OPTIONS.length) {
            onChange(SORT_OPTIONS[index]);
          }
        },
      );
    } else {
      // Simple toggle through options on Android
      const currentIdx = SORT_OPTIONS.indexOf(value);
      const nextIdx = (currentIdx + 1) % SORT_OPTIONS.length;
      onChange(SORT_OPTIONS[nextIdx]);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Box flexDirection="row" alignItems="center" gap="xs">
        <Icon source="sort" size={moderateScale(16)} color="textSecondary" />
        <Text style={styles.label}>{labels[value]}</Text>
        <Icon source="chevron-down" size={moderateScale(14)} color="textSecondary" />
      </Box>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  label: {fontSize: moderateScale(13), color: palette.gray600},
});
