import React from 'react';
import {TouchableOpacity, View, type DimensionValue} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {Box, Text, Icon} from '../../../design';
import {fonts} from '../../../theme/fonts';
import {moderateScale} from '../../../theme/scaling';
import {styles} from '../RouteDetailScreen.styles';

type TabKey = 'list' | 'map';

interface RouteDetailHeaderProps {
  name: string;
  dateRangeText: string;
  visited: number;
  total: number;
  activeTab: TabKey;
  isEditing: boolean;
  onGoBack: () => void;
  onToggleEdit: () => void;
  onEditSettings: () => void;
  onTabChange: (tab: TabKey) => void;
}

export function RouteDetailHeader({
  name,
  dateRangeText,
  visited,
  total,
  activeTab,
  isEditing,
  onGoBack,
  onToggleEdit,
  onEditSettings,
  onTabChange,
}: RouteDetailHeaderProps) {
  const {t} = useTranslation('routes');
  const insets = useSafeAreaInsets();

  return (
    <Box
      backgroundColor="mainBackground"
      style={[styles.headerContainer, {paddingTop: insets.top + moderateScale(12)}]}>
      {/* Back + Title row */}
      <Box flexDirection="row" alignItems="center" marginBottom="xs">
        {!isEditing && (
          <TouchableOpacity
            onPress={onGoBack}
            activeOpacity={0.7}
            accessibilityLabel={t('back', {defaultValue: 'Go back'})}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon source="chevron-left" size={moderateScale(32)} color="textPrimary" />
          </TouchableOpacity>
        )}
        <Text
          style={[styles.title, {fontFamily: fonts.bold}]}
          color="textHeading"
          numberOfLines={1}>
          {name}
        </Text>
        {isEditing && (
          <TouchableOpacity
            onPress={onEditSettings}
            activeOpacity={0.7}
            accessibilityLabel={t('editTitle')}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            style={styles.editSettingsButton}>
            <Icon
              source="pencil-outline"
              size={moderateScale(22)}
              color="textPrimary"
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onToggleEdit}
          activeOpacity={0.7}
          accessibilityLabel={isEditing ? t('done') : t('edit')}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Text style={[styles.editButton, {fontFamily: fonts.bold}]}>
            {isEditing ? t('done') : t('edit')}
          </Text>
        </TouchableOpacity>
      </Box>

      {/* Date range subtitle */}
      <Box paddingHorizontal="m" marginBottom="xs">
        <Text
          style={[styles.subtitle, {fontFamily: fonts.regular}]}
          color="textSecondary">
          {dateRangeText}
        </Text>
      </Box>

      {/* Visited count */}
      <Box paddingHorizontal="m" marginBottom="s">
        <Text
          style={[styles.subtitle, {fontFamily: fonts.regular}]}
          color="textSecondary">
          {t('visitedCount', {current: visited, total})}
        </Text>
      </Box>

      {/* Progress bar */}
      <Box paddingHorizontal="m" marginBottom="s">
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  (total > 0 ? `${(visited / total) * 100}%` : '0%') as DimensionValue,
              },
            ]}
          />
        </View>
      </Box>

      {/* Tab bar */}
      <Box flexDirection="row">
        <TouchableOpacity
          onPress={() => onTabChange('list')}
          activeOpacity={0.7}
          accessibilityLabel={t('tabList')}
          style={styles.tabButton}>
          <Text
            style={[
              styles.tabText,
              {fontFamily: activeTab === 'list' ? fonts.bold : fonts.regular},
              activeTab === 'list' ? styles.tabTextActive : styles.tabTextInactive,
            ]}>
            {t('tabList')}
          </Text>
          <View
            style={[
              styles.tabUnderline,
              activeTab === 'list' ? styles.tabUnderlineActive : styles.tabUnderlineInactive,
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTabChange('map')}
          activeOpacity={0.7}
          accessibilityLabel={t('tabMap')}
          style={styles.tabButton}>
          <Text
            style={[
              styles.tabText,
              {fontFamily: activeTab === 'map' ? fonts.bold : fonts.regular},
              activeTab === 'map' ? styles.tabTextActive : styles.tabTextInactive,
            ]}>
            {t('tabMap')}
          </Text>
          <View
            style={[
              styles.tabUnderline,
              activeTab === 'map' ? styles.tabUnderlineActive : styles.tabUnderlineInactive,
            ]}
          />
        </TouchableOpacity>
      </Box>
    </Box>
  );
}
