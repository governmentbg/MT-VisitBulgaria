import React from 'react';
import {StyleSheet} from 'react-native';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {CmsRenderer} from '../common/CmsRenderer';
import {
  isNonEmptyLexical,
  type LexicalRoot,
} from '../../services/api/types/lexical';

interface DetailAboutSectionProps {
  title: string;
  content: LexicalRoot | null | undefined;
}

export const DetailAboutSection = React.memo(function DetailAboutSection({
  title,
  content,
}: DetailAboutSectionProps) {
  if (!isNonEmptyLexical(content)) return null;
  return (
    <Box marginTop="l" gap="s">
      <Text fontFamily={fonts.bold} style={styles.sectionTitle}>
        {title}
      </Text>
      <CmsRenderer value={content} />
    </Box>
  );
});

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.2),
    color: palette.heading,
  },
});
