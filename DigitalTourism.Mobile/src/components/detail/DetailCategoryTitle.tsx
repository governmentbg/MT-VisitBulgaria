import React from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';

interface DetailCategoryTitleProps {
  emoji: string;
  categoryName: string;
  name: string;
  subtitle?: string;
  location?: string;
}

/** Resolve category name — if it's an i18n key (contains ':'), translate it */
function useCategoryName(categoryName: string): string {
  const {t} = useTranslation();
  if (categoryName.includes(':')) {
    return t(categoryName);
  }
  return categoryName;
}

export const DetailCategoryTitle = React.memo(function DetailCategoryTitle({
  emoji,
  categoryName,
  name,
  subtitle,
  location,
}: DetailCategoryTitleProps) {
  const resolvedCategory = useCategoryName(categoryName);
  return (
    <Box paddingVertical="s" gap="s">
      <Text fontFamily={fonts.bold} color="textSecondary" style={styles.categoryLabel}>
        {emoji} {resolvedCategory}
      </Text>
      <Text fontFamily={fonts.bold} style={styles.title}>
        {name}
      </Text>
      {subtitle && (
        <Text color="textSecondary" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
      {location && (
        <Text color="textSecondary" style={styles.location}>
          {'\u{1F4CD}'} {location}
        </Text>
      )}
    </Box>
  );
});

const styles = StyleSheet.create({
  categoryLabel: {
    fontSize: moderateScale(14),
  },
  title: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
    color: palette.heading,
  },
  subtitle: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14 * 1.5),
  },
  location: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(13 * 1.5),
  },
});
