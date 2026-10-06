import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, LayoutAnimation} from 'react-native';
import {Box, Text, Icon} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';

interface FacetItem {
  value: string;
  count: number;
}

interface FacetSectionProps {
  title: string;
  items: FacetItem[];
  selected: string[];
  onToggle: (value: string) => void;
  maxVisible?: number;
  defaultExpanded?: boolean;
}

export function FacetSection({
  title,
  items,
  selected,
  onToggle,
  maxVisible = 5,
  defaultExpanded = false,
}: FacetSectionProps) {
  const {t} = useTranslation('common');
  const [expanded, setExpanded] = useState(defaultExpanded || selected.length > 0);
  const [showAll, setShowAll] = useState(false);

  const shouldTruncate = items.length > maxVisible;
  const visibleItems = shouldTruncate && !showAll ? items.slice(0, maxVisible) : items;
  const hiddenCount = shouldTruncate ? items.length - maxVisible : 0;

  const selectedCount = selected.length;

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  const toggleShowAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAll(prev => !prev);
  };

  return (
    <Box marginBottom="m">
      {/* Header */}
      <TouchableOpacity
        onPress={toggleExpanded}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{expanded}}>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" paddingVertical="s">
          <Box flexDirection="row" alignItems="center" gap="xs">
            <Text fontFamily={fonts.bold} style={styles.sectionTitle}>{title}</Text>
            {selectedCount > 0 && (
              <Box style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{selectedCount}</Text>
              </Box>
            )}
          </Box>
          <Icon
            source={expanded ? 'chevron-up' : 'chevron-down'}
            size={moderateScale(20)}
            color="textSecondary"
          />
        </Box>
      </TouchableOpacity>

      {/* Content */}
      {expanded && (
        <Box marginTop="xs" gap="xs">
          {visibleItems.map(item => (
            <TouchableOpacity
              key={item.value}
              onPress={() => onToggle(item.value)}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{checked: selected.includes(item.value)}}
              accessibilityLabel={t('a11y.facetCheckbox', {value: item.value, count: item.count})}>
              <Box flexDirection="row" alignItems="center" paddingVertical="xs" gap="s">
                <Icon
                  source={selected.includes(item.value) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={moderateScale(20)}
                  color={selected.includes(item.value) ? 'primary' : 'textSecondary'}
                />
                <Text style={styles.itemLabel} numberOfLines={1}>{item.value}</Text>
                <Text style={styles.itemCount}>{item.count}</Text>
              </Box>
            </TouchableOpacity>
          ))}

          {/* Show more/less */}
          {shouldTruncate && (
            <TouchableOpacity onPress={toggleShowAll} activeOpacity={0.7}>
              <Text style={styles.showMoreText}>
                {showAll
                  ? t('showLess', {defaultValue: 'Show less'})
                  : t('showMore', {count: hiddenCount, defaultValue: 'Show {{count}} more'})}
              </Text>
            </TouchableOpacity>
          )}
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {fontSize: moderateScale(15), color: palette.heading},
  countBadge: {
    backgroundColor: palette.green700,
    borderRadius: 10,
    minWidth: moderateScale(20),
    height: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countBadgeText: {fontSize: moderateScale(11), color: palette.white, fontWeight: '700'},
  itemLabel: {flex: 1, fontSize: moderateScale(14), color: palette.black},
  itemCount: {fontSize: moderateScale(13), color: palette.gray600},
  showMoreText: {fontSize: moderateScale(13), color: palette.green700, fontWeight: '600', marginTop: moderateScale(4)},
});
