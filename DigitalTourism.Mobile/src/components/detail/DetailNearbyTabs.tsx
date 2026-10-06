import React, {useCallback, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {palette} from '../../theme/palette';
import {moderateScale} from '../../theme/scaling';
import {DetailNearbyCard, type DetailNearbyItem} from './DetailNearbyCard';

type TabKey = 'nearby' | 'similar';

interface DetailNearbyTabsProps {
  similarItems: DetailNearbyItem[];
  nearbyItems: DetailNearbyItem[];
  /** Overrides per-item category display on the Similar tab (which is always single-type). */
  categoryLabel?: string;
  cardStyle?: 'flat' | 'elevated';
  onItemPress: (id: string, type?: string) => void;
}

export const DetailNearbyTabs = React.memo(function DetailNearbyTabs({
  similarItems,
  nearbyItems,
  categoryLabel,
  cardStyle = 'flat',
  onItemPress,
}: DetailNearbyTabsProps) {
  const {t} = useTranslation('common');
  const hasNearby = nearbyItems.length > 0;
  const hasSimilar = similarItems.length > 0;

  const [activeTab, setActiveTab] = useState<TabKey>(
    hasNearby ? 'nearby' : 'similar',
  );

  if (!hasNearby && !hasSimilar) {
    return null;
  }

  const effectiveTab: TabKey = hasNearby && hasSimilar
    ? activeTab
    : hasNearby
      ? 'nearby'
      : 'similar';

  const items = effectiveTab === 'similar' ? similarItems : nearbyItems;
  // Nearby tab is cross-type — each card resolves its own label from item.type.
  const activeCategoryLabel =
    effectiveTab === 'similar' ? categoryLabel : undefined;

  const showTabs = hasNearby && hasSimilar;
  const singleTitle = hasNearby
    ? t('nearby', {defaultValue: 'Nearby'})
    : t('similar', {defaultValue: 'Similar'});

  return (
    <Box gap="m" marginBottom="m">
      {showTabs ? (
        <Box
          flexDirection="row"
          alignItems="center"
          backgroundColor="surfaceBackground"
          borderRadius="full"
          height={moderateScale(36)}
          alignSelf="flex-start"
          style={styles.tabs}>
          <Tab
            label={t('nearby', {defaultValue: 'Nearby'})}
            isActive={effectiveTab === 'nearby'}
            onPress={() => setActiveTab('nearby')}
          />
          <Tab
            label={t('similar', {defaultValue: 'Similar'})}
            isActive={effectiveTab === 'similar'}
            onPress={() => setActiveTab('similar')}
          />
        </Box>
      ) : (
        <Text fontFamily={fonts.bold} style={styles.sectionTitle}>
          {singleTitle}
        </Text>
      )}

      {items.map(item => (
        <TabItem
          key={`${effectiveTab}-${item.id}`}
          item={item}
          categoryLabel={activeCategoryLabel}
          cardStyle={cardStyle}
          onPress={onItemPress}
        />
      ))}
    </Box>
  );
});

const TabItem = React.memo(function TabItem({
  item,
  categoryLabel,
  cardStyle,
  onPress,
}: {
  item: DetailNearbyItem;
  categoryLabel?: string;
  cardStyle: 'flat' | 'elevated';
  onPress: (id: string, type?: string) => void;
}) {
  const handlePress = useCallback(
    () => onPress(item.id, item.type),
    [onPress, item.id, item.type],
  );
  return (
    <DetailNearbyCard
      item={item}
      categoryLabel={categoryLabel}
      cardStyle={cardStyle}
      onPress={handlePress}
    />
  );
});

interface TabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function Tab({label, isActive, onPress}: TabProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="tab"
      accessibilityState={{selected: isActive}}
      style={styles.tabTouchable}>
      <Box
        borderRadius="full"
        paddingHorizontal="m"
        alignItems="center"
        justifyContent="center"
        backgroundColor={isActive ? 'mainBackground' : undefined}
        style={[
          styles.tabInner,
          {borderColor: isActive ? palette.white : palette.gray50},
          isActive && styles.activeTab,
        ]}>
        <Text
          variant="small"
          fontFamily={fonts.bold}
          color={isActive ? 'primary' : 'textSecondary'}>
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.2),
    color: palette.heading,
    fontFamily: fonts.bold,
  },
  tabs: {
    padding: moderateScale(3),
    shadowColor: '#141414',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  tabTouchable: {
    height: '100%',
  },
  tabInner: {
    height: '100%',
    minWidth: moderateScale(88),
    borderWidth: StyleSheet.hairlineWidth,
  },
  activeTab: {
    shadowColor: '#141414',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
