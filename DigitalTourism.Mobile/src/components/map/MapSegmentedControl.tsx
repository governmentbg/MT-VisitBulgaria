import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Text} from '../../design';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {useTranslation} from 'react-i18next';

export type MapViewMode = 'map' | 'list';

interface MapSegmentedControlProps {
  activeMode: MapViewMode;
  onModeChange: (mode: MapViewMode) => void;
  /** When true, renders inline (not absolutely positioned). Used in list view header. */
  embedded?: boolean;
}

/**
 * Map/List segmented control toggle.
 * Gray pill background with white active segment.
 */
export function MapSegmentedControl({
  activeMode,
  onModeChange,
  embedded = false,
}: MapSegmentedControlProps) {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation('map');

  const control = (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      backgroundColor="surfaceBackground"
      borderRadius="full"
      height={moderateScale(32)}
      width={moderateScale(140)}
      style={[styles.container, {padding: moderateScale(2)}]}>
      <Segment
        label={t('mapTab')}
        isActive={activeMode === 'map'}
        onPress={() => onModeChange('map')}
      />
      <Segment
        label={t('listTab')}
        isActive={activeMode === 'list'}
        onPress={() => onModeChange('list')}
      />
    </Box>
  );

  if (embedded) {
    return control;
  }

  return (
    <Box
      position="absolute"
      left={0}
      style={{top: insets.top + moderateScale(64)}}
      paddingHorizontal="m">
      {control}
    </Box>
  );
}

interface SegmentProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function Segment({label, isActive, onPress}: SegmentProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.segmentTouchable}>
      <Box
        flex={1}
        borderRadius="full"
        alignItems="center"
        justifyContent="center"
        backgroundColor={isActive ? 'mainBackground' : undefined}
        style={isActive ? styles.activeSegment : undefined}>
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
  container: {
    shadowColor: '#141414',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  segmentTouchable: {
    flex: 1,
    height: '100%',
  },
  activeSegment: {
    shadowColor: '#141414',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
