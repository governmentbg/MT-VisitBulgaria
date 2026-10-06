import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {DetailNearbyCard} from './DetailNearbyCard';
import type {DetailNearbyItem} from './DetailNearbyCard';

interface DetailNearbySectionProps {
  title: string;
  items: DetailNearbyItem[];
  categoryLabel?: string;
  onItemPress: (id: string, type?: string) => void;
  cardStyle?: 'flat' | 'elevated';
}

const NearbyItem = React.memo(function NearbyItem({
  item,
  categoryLabel,
  onPress,
  cardStyle,
}: {
  item: DetailNearbyItem;
  categoryLabel?: string;
  onPress: (id: string, type?: string) => void;
  cardStyle: 'flat' | 'elevated';
}) {
  const handlePress = useCallback(
    () => onPress(item.id, item.type),
    [onPress, item.id, item.type],
  );
  return (
    <DetailNearbyCard
      item={item}
      categoryLabel={categoryLabel}
      onPress={handlePress}
      cardStyle={cardStyle}
    />
  );
});

export const DetailNearbySection = React.memo(function DetailNearbySection({
  title,
  items,
  categoryLabel,
  onItemPress,
  cardStyle = 'flat',
}: DetailNearbySectionProps) {
  return (
    <Box gap="m" marginBottom="m">
      <Text fontFamily={fonts.bold} style={styles.sectionTitle}>
        {title}
      </Text>
      {items.map(item => (
        <NearbyItem
          key={item.id}
          item={item}
          categoryLabel={categoryLabel}
          onPress={onItemPress}
          cardStyle={cardStyle}
        />
      ))}
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
