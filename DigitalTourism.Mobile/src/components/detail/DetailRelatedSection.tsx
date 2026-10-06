import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Box, Text, Image, Icon, ResizeMode} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {TYPE_EMOJI} from '../../constants';
import {useTranslation} from 'react-i18next';

interface RelatedItem {
  id: string;
  name: string;
  type: string;
  imageUrl?: string;
}

interface DetailRelatedSectionProps {
  title: string;
  items: RelatedItem[];
  onItemPress: (type: string, id: string) => void;
}

const RelatedCard = React.memo(function RelatedCard({
  item,
  onPress,
  t,
}: {
  item: RelatedItem;
  onPress: (type: string, id: string) => void;
  t: (key: string, options?: Record<string, string>) => string;
}) {
  const handlePress = useCallback(() => onPress(item.type, item.id), [onPress, item.type, item.id]);
  return (
    <TouchableOpacity
      key={`${item.type}_${item.id}`}
      onPress={handlePress}
      activeOpacity={0.7}
      style={styles.card}>
      <Box width={moderateScale(140)} height={moderateScale(100)} borderRadius="l" overflow="hidden">
        {item.imageUrl ? (
          <Image source={{uri: item.imageUrl}} style={styles.image} resizeMode={ResizeMode.cover} />
        ) : (
          <Box flex={1} backgroundColor="surfaceBackground" alignItems="center" justifyContent="center">
            <Icon source="image-off-outline" size={24} color="textSecondary" />
          </Box>
        )}
      </Box>
      <Text fontFamily={fonts.bold} numberOfLines={2} style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.typeLabel}>
        {TYPE_EMOJI[item.type] || '\uD83D\uDCCD'} {t(`filterLabels.${item.type}`, {defaultValue: item.type})}
      </Text>
    </TouchableOpacity>
  );
});

export function DetailRelatedSection({title, items, onItemPress}: DetailRelatedSectionProps) {
  const {t} = useTranslation('map');
  if (items.length === 0) return null;

  return (
    <Box marginTop="l" gap="m">
      <Text fontFamily={fonts.bold} style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {items.map(item => (
          <RelatedCard
            key={`${item.type}_${item.id}`}
            item={item}
            onPress={onItemPress}
            t={t}
          />
        ))}
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {fontSize: moderateScale(16), color: palette.heading},
  scrollContent: {paddingRight: moderateScale(16), gap: moderateScale(12)},
  card: {width: moderateScale(140), gap: moderateScale(4)},
  image: {width: '100%', height: '100%'},
  itemTitle: {fontSize: moderateScale(13), color: palette.heading, lineHeight: moderateScale(16)},
  typeLabel: {fontSize: moderateScale(11), color: palette.gray600},
});
