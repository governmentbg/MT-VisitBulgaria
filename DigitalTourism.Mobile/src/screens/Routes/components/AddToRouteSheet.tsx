import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image as RNImage,
  ActivityIndicator,
} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Box, Text, Icon} from '../../../design';
import {bottomSheetStyles} from '../../../theme/bottomSheet';
import {moderateScale} from '../../../theme/scaling';
import {palette} from '../../../theme/palette';
import {fonts} from '../../../theme/fonts';
import {useBottomSheetBackdrop} from '../../../hooks/useBottomSheetBackdrop';
import {useRoutes} from '../../../hooks/queries/useRoutes';
import {useAddRouteStop} from '../../../hooks/mutations/useRouteItems';
import {useAlert} from '../../../contexts/AlertContext';
import type {Route, RouteExperienceType} from '../../../models/Route';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../navigation/types';

interface AddToRouteSheetProps {
  visible: boolean;
  onClose: () => void;
  experienceType: RouteExperienceType;
  experienceId: number;
  experienceName: string;
}

const SNAP_POINTS = ['85%'];

export function AddToRouteSheet({
  visible,
  onClose,
  experienceType,
  experienceId,
  experienceName,
}: AddToRouteSheetProps) {
  const {t} = useTranslation('routes');
  const {t: tCommon} = useTranslation('common');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {alert} = useAlert();
  const sheetRef = useRef<BottomSheetModal>(null);
  const renderBackdrop = useBottomSheetBackdrop();
  const {data: routes = [], isLoading} = useRoutes();
  const addStop = useAddRouteStop();

  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setSelectedRouteId(null);
      setSelectedDayIndex(0);
    }
  }, [visible]);

  const handleSelectRoute = useCallback((route: Route) => {
    setSelectedRouteId(prev => (prev === route.id ? null : route.id));
    setSelectedDayIndex(0);
  }, []);

  const handleSelectDay = useCallback((dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
  }, []);

  const handleCreateRoute = useCallback(() => {
    onClose();
    navigation.navigate('CreateRoute');
  }, [navigation, onClose]);

  const handleAdd = useCallback(async () => {
    if (selectedRouteId == null) return;
    try {
      await addStop.mutateAsync({
        routeId: selectedRouteId,
        dayIndex: selectedDayIndex,
        experienceType,
        experienceId,
      });
      onClose();
      alert(
        tCommon('labels.success', {defaultValue: 'Success'}),
        tCommon('addedToRoute', {defaultValue: 'Added to your route'}),
      );
    } catch {
      alert(
        tCommon('labels.error', {defaultValue: 'Error'}),
        tCommon('errors.error', {defaultValue: 'Something went wrong'}),
      );
    }
  }, [
    addStop,
    selectedRouteId,
    selectedDayIndex,
    experienceType,
    experienceId,
    onClose,
    alert,
    tCommon,
  ]);

  const primaryLabel =
    selectedRouteId != null
      ? tCommon('add', {defaultValue: 'Add'})
      : t('createNew', {defaultValue: 'Create new route'});
  const primaryHandler =
    selectedRouteId != null ? handleAdd : handleCreateRoute;
  const primaryDisabled = addStop.isPending;

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={SNAP_POINTS}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={bottomSheetStyles.sheetBackground}
      handleIndicatorStyle={bottomSheetStyles.handleIndicator}>
      <BottomSheetView style={styles.container}>
        {/* Header */}
        <Box paddingHorizontal="m" paddingTop="s" paddingBottom="m">
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text style={styles.title}>
              {tCommon('addToRoute', {defaultValue: 'Add to route'})}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              accessibilityLabel={tCommon('buttons.close', {
                defaultValue: 'Close',
              })}>
              <Icon
                source="close"
                size={moderateScale(20)}
                color="textSecondary"
              />
            </TouchableOpacity>
          </Box>
          <Text style={styles.subtitle}>
            {tCommon('addToRouteAdding', {defaultValue: 'Adding: '})}
            <Text style={[styles.subtitle, styles.subtitleBold]}>
              {experienceName}
            </Text>
          </Text>
        </Box>

        <Box height={StyleSheet.hairlineWidth} backgroundColor="gray100" />

        {/* Body */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <Box paddingVertical="xl" alignItems="center">
              <ActivityIndicator color={palette.green500} />
            </Box>
          ) : routes.length === 0 ? (
            <Box paddingVertical="xl" alignItems="center">
              <Text style={styles.emptyTitle}>{t('emptyTitle')}</Text>
              <Text style={styles.emptyMessage}>{t('emptyDescription')}</Text>
            </Box>
          ) : (
            routes.map(route => (
              <RouteOption
                key={route.id}
                route={route}
                expanded={selectedRouteId === route.id}
                selectedDayIndex={selectedDayIndex}
                onPressRoute={() => handleSelectRoute(route)}
                onSelectDay={handleSelectDay}
              />
            ))
          )}
        </ScrollView>

        {/* Footer */}
        <Box
          paddingHorizontal="m"
          paddingTop="s"
          paddingBottom="l"
          borderTopWidth={StyleSheet.hairlineWidth}
          borderTopColor="gray100">
          <TouchableOpacity
            onPress={primaryHandler}
            disabled={primaryDisabled}
            activeOpacity={0.8}
            style={[
              styles.primaryButton,
              primaryDisabled && styles.primaryButtonDisabled,
            ]}>
            {addStop.isPending ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <Text style={styles.primaryButtonLabel}>{primaryLabel}</Text>
            )}
          </TouchableOpacity>
        </Box>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

interface RouteOptionProps {
  route: Route;
  expanded: boolean;
  selectedDayIndex: number;
  onPressRoute: () => void;
  onSelectDay: (index: number) => void;
}

function RouteOption({
  route,
  expanded,
  selectedDayIndex,
  onPressRoute,
  onSelectDay,
}: RouteOptionProps) {
  const {t} = useTranslation('routes');
  const {t: tCommon} = useTranslation('common');

  const stopCount = useMemo(
    () => route.days.reduce((sum, d) => sum + d.stops.length, 0),
    [route.days],
  );

  const avatarImages = useMemo(() => {
    return route.days
      .flatMap(d => d.stops)
      .filter(s => !!s.image)
      .slice(0, 4)
      .map(s => s.image as string);
  }, [route.days]);

  return (
    <Box style={styles.routeCard}>
      <TouchableOpacity
        onPress={onPressRoute}
        activeOpacity={0.8}
        style={styles.routeHeader}>
        <Box flex={1}>
          <Box
            flexDirection="row"
            marginBottom="s"
            height={moderateScale(40)}>
            {avatarImages.length === 0 ? (
              <Box
                width={moderateScale(40)}
                height={moderateScale(40)}
                borderRadius="full"
                backgroundColor="surfaceBackground"
                alignItems="center"
                justifyContent="center">
                <Icon
                  source="map-marker-outline"
                  size={moderateScale(18)}
                  color="textSecondary"
                />
              </Box>
            ) : (
              avatarImages.map((uri, i) => (
                <RNImage
                  key={`${uri}-${i}`}
                  source={{uri}}
                  style={[
                    styles.avatar,
                    i > 0 && styles.avatarOverlap,
                    {zIndex: avatarImages.length - i},
                  ]}
                />
              ))
            )}
          </Box>
          <Text style={styles.routeName} numberOfLines={1}>
            {route.name}
          </Text>
          <Text style={styles.routeMeta}>
            {tCommon('items', {count: stopCount})}
          </Text>
        </Box>
        <Box
          width={moderateScale(40)}
          height={moderateScale(40)}
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
          style={expanded ? styles.circleActive : styles.circleInactive}>
          <Icon
            source={expanded ? 'check' : 'plus'}
            size={moderateScale(20)}
            color={expanded ? 'primary' : 'textSecondary'}
          />
        </Box>
      </TouchableOpacity>

      {expanded && (
        <Box paddingHorizontal="m" paddingBottom="m">
          <Text style={styles.selectDay}>{t('selectDay')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayChipRow}>
            {route.days.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <TouchableOpacity
                  key={day.dayNumber}
                  onPress={() => onSelectDay(idx)}
                  activeOpacity={0.8}
                  style={[
                    styles.dayChip,
                    isSelected && styles.dayChipSelected,
                  ]}>
                  {isSelected && (
                    <Box marginRight="s">
                      <Icon
                        source="check"
                        size={moderateScale(14)}
                        color="white"
                      />
                    </Box>
                  )}
                  <Box alignItems="center">
                    <Text
                      style={[
                        styles.dayChipLabel,
                        isSelected && styles.dayChipLabelSelected,
                      ]}>
                      {t('day', {number: day.dayNumber})}
                    </Text>
                    <Text
                      style={[
                        styles.dayChipMeta,
                        isSelected && styles.dayChipMetaSelected,
                      ]}>
                      {tCommon('items', {count: day.stops.length})}
                    </Text>
                  </Box>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
    color: palette.heading,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14 * 1.5),
    color: palette.gray600,
    marginTop: moderateScale(4),
  },
  subtitleBold: {
    fontFamily: fonts.bold,
  },
  scrollContent: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(12),
    gap: moderateScale(12),
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: moderateScale(18),
    color: palette.heading,
    textAlign: 'center',
  },
  emptyMessage: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(14),
    color: palette.gray600,
    textAlign: 'center',
    marginTop: moderateScale(4),
  },
  routeCard: {
    backgroundColor: palette.white,
    borderRadius: moderateScale(16),
    shadowColor: palette.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
  },
  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    borderWidth: 2,
    borderColor: palette.white,
  },
  avatarOverlap: {
    marginLeft: -moderateScale(10),
  },
  routeName: {
    fontFamily: fonts.bold,
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18 * 1.2),
    color: palette.heading,
  },
  routeMeta: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14 * 1.5),
    color: palette.gray600,
    marginTop: moderateScale(2),
  },
  circleActive: {
    backgroundColor: palette.green50,
  },
  circleInactive: {
    backgroundColor: palette.gray100,
  },
  selectDay: {
    fontFamily: fonts.bold,
    fontSize: moderateScale(18),
    color: palette.heading,
  },
  dayChipRow: {
    paddingTop: moderateScale(8),
    gap: moderateScale(8),
  },
  dayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: palette.gray100,
    backgroundColor: palette.white,
    minHeight: moderateScale(55),
  },
  dayChipSelected: {
    backgroundColor: palette.green500,
    borderColor: palette.green500,
  },
  dayChipLabel: {
    fontFamily: fonts.bold,
    fontSize: moderateScale(14),
    color: palette.heading,
  },
  dayChipLabelSelected: {
    color: palette.white,
  },
  dayChipMeta: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(12),
    color: palette.gray600,
    marginTop: moderateScale(4),
  },
  dayChipMetaSelected: {
    color: palette.white,
  },
  primaryButton: {
    height: moderateScale(48),
    borderRadius: moderateScale(48),
    backgroundColor: palette.green700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonLabel: {
    fontFamily: fonts.bold,
    fontSize: moderateScale(16),
    color: palette.white,
  },
});
