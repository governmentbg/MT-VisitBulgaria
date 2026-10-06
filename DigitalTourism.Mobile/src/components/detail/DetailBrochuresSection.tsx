import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {Box, Text, Icon} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';

interface Brochure {
  url: string;
  title: string;
  filesize?: number;
}

interface DetailBrochuresSectionProps {
  title: string;
  brochures: Brochure[];
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const BrochureItem = React.memo(function BrochureItem({brochure}: {brochure: Brochure}) {
  const {t} = useTranslation('common');
  const handlePress = useCallback(() => Linking.openURL(brochure.url).catch(err => { if (__DEV__) console.warn('[Brochures] Failed to open URL:', err); }), [brochure.url]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={t('a11y.brochureDownload', {title: brochure.title})}
      accessibilityRole="link">
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="surfaceBackground"
        borderRadius="l"
        padding="m"
        gap="m">
        <Icon source="file-document-outline" size={moderateScale(24)} color="primary" />
        <Box flex={1}>
          <Text fontFamily={fonts.bold} numberOfLines={1} style={styles.brochureTitle}>{brochure.title}</Text>
          {brochure.filesize ? (
            <Text style={styles.fileSize}>{formatFileSize(brochure.filesize)}</Text>
          ) : null}
        </Box>
        <Icon source="download" size={moderateScale(20)} color="primary" />
      </Box>
    </TouchableOpacity>
  );
});

export function DetailBrochuresSection({title, brochures}: DetailBrochuresSectionProps) {
  if (brochures.length === 0) return null;

  return (
    <Box marginTop="l" gap="m">
      <Text fontFamily={fonts.bold} style={styles.sectionTitle}>{title}</Text>
      {brochures.map((b) => (
        <BrochureItem key={b.url} brochure={b} />
      ))}
    </Box>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {fontSize: moderateScale(16), color: palette.heading},
  brochureTitle: {fontSize: moderateScale(14), color: palette.heading},
  fileSize: {fontSize: moderateScale(12), color: palette.gray600, marginTop: 2},
});
