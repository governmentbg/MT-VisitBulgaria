import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {Box, Text, Icon} from '../../../design';
import {useBottomSheetBackdrop} from '../../../hooks/useBottomSheetBackdrop';
import {fonts} from '../../../theme/fonts';
import {moderateScale} from '../../../theme/scaling';
import {palette} from '../../../theme/palette';
import {useUpdateRoute} from '../../../hooks/mutations/useUpdateRoute';
import {formatDateRange} from '../../../utils/dateHelpers';
import {RouteDatePicker} from './RouteDatePicker';
import type {Route} from '../../../models/Route';

interface RouteSettingsSheetProps {
  visible: boolean;
  onDismiss: () => void;
  route: Route;
}

export function RouteSettingsSheet({
  visible,
  onDismiss,
  route,
}: RouteSettingsSheetProps) {
  const {t, i18n} = useTranslation('routes');
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const renderBackdrop = useBottomSheetBackdrop('close', 0.5);
  const updateRoute = useUpdateRoute();

  const [name, setName] = useState(route.name);
  const [startDate, setStartDate] = useState<string>(route.startDate);
  const [duration, setDuration] = useState<number>(route.duration);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Reset form state to the latest route whenever the sheet is opened.
  useEffect(() => {
    if (visible) {
      setName(route.name);
      setStartDate(route.startDate);
      setDuration(route.duration);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, route.name, route.startDate, route.duration]);

  const isValid = name.trim().length > 0 && !!startDate && duration > 0;
  const dateDisplayText = useMemo(
    () => formatDateRange(startDate, duration, i18n.language),
    [startDate, duration, i18n.language],
  );

  const handleDateConfirm = useCallback(
    (selectedStartDate: string, selectedDuration: number) => {
      setStartDate(selectedStartDate);
      setDuration(selectedDuration);
      setDatePickerVisible(false);
    },
    [],
  );

  const handleSave = useCallback(() => {
    if (!isValid) return;
    Keyboard.dismiss();
    updateRoute.mutate(
      {
        id: route.id,
        updates: {name: name.trim(), startDate, duration},
      },
      {
        onSuccess: () => {
          onDismiss();
        },
      },
    );
  }, [isValid, updateRoute, route.id, name, startDate, duration, onDismiss]);

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        enableHandlePanningGesture
        enableContentPanningGesture={false}
        stackBehavior="push"
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}>
        <BottomSheetView style={styles.content}>
          <Box paddingHorizontal="m" marginBottom="m">
            <Text
              fontFamily={fonts.bold}
              color="textHeading"
              style={styles.heading}>
              {t('editTitle')}
            </Text>
          </Box>

          {/* Route name field */}
          <Box paddingHorizontal="m" marginBottom="l">
            <Text
              fontFamily={fonts.bold}
              color="textHeading"
              style={styles.label}
              marginBottom="s">
              {t('routeNameRequired')}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                isNameFocused && styles.textInputFocused,
              ]}
              placeholder={t('routeNamePlaceholder')}
              placeholderTextColor={palette.gray400}
              value={name}
              onChangeText={setName}
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
              autoCapitalize="sentences"
              returnKeyType="done"
            />
          </Box>

          {/* Dates field */}
          <Box paddingHorizontal="m" marginBottom="l">
            <Text
              fontFamily={fonts.bold}
              color="textHeading"
              style={styles.label}
              marginBottom="s">
              {t('datesRequired')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setDatePickerVisible(true)}>
              <Box
                flexDirection="row"
                alignItems="center"
                style={styles.dateField}>
                <Icon
                  source="calendar-blank-outline"
                  size="m"
                  color="textTertiary"
                />
                <Text
                  style={[
                    styles.dateText,
                    !dateDisplayText && styles.dateTextPlaceholder,
                  ]}
                  color={dateDisplayText ? 'textPrimary' : 'textTertiary'}
                  numberOfLines={1}>
                  {dateDisplayText || t('datesPlaceholder')}
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>

          {/* Action buttons */}
          <Box
            flexDirection="row"
            paddingHorizontal="m"
            marginBottom="l"
            style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onDismiss}
              style={styles.actionButtonWrapper}>
              <Box
                height={moderateScale(48)}
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
                style={styles.cancelButton}>
                <Text fontFamily={fonts.bold} style={styles.cancelButtonText}>
                  {t('cancel')}
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={isValid ? 0.8 : 1}
              disabled={!isValid || updateRoute.isPending}
              onPress={handleSave}
              style={styles.actionButtonWrapper}>
              <Box
                height={moderateScale(48)}
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
                style={
                  isValid ? styles.saveButton : styles.saveButtonDisabled
                }>
                <Text
                  fontFamily={fonts.bold}
                  style={[
                    styles.saveButtonText,
                    !isValid && styles.saveButtonTextDisabled,
                  ]}>
                  {t('save')}
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </BottomSheetView>
      </BottomSheetModal>

      <RouteDatePicker
        visible={datePickerVisible}
        onDismiss={() => setDatePickerVisible(false)}
        onConfirm={handleDateConfirm}
        initialStartDate={startDate}
        initialDuration={duration}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    backgroundColor: palette.gray300,
    width: 48,
  },
  content: {
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(16),
  },
  heading: {
    fontSize: moderateScale(22),
    lineHeight: moderateScale(22 * 1.2),
  },
  label: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.2),
  },
  textInput: {
    height: moderateScale(48),
    borderWidth: 1,
    borderColor: palette.gray100,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    fontSize: moderateScale(16),
    fontFamily: fonts.regular,
    color: palette.heading,
    backgroundColor: palette.white,
  },
  textInputFocused: {
    borderColor: palette.green500,
  },
  dateField: {
    height: moderateScale(48),
    borderWidth: 1,
    borderColor: palette.gray100,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    backgroundColor: palette.white,
    gap: moderateScale(8),
  },
  dateText: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: fonts.regular,
  },
  dateTextPlaceholder: {
    fontFamily: fonts.regular,
  },
  actionsRow: {
    gap: moderateScale(12),
  },
  actionButtonWrapper: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: palette.green700,
  },
  saveButtonDisabled: {
    backgroundColor: palette.gray200,
  },
  saveButtonText: {
    fontSize: moderateScale(16),
    color: palette.white,
  },
  saveButtonTextDisabled: {
    color: palette.gray600,
  },
  cancelButton: {
    backgroundColor: palette.green50,
  },
  cancelButtonText: {
    fontSize: moderateScale(16),
    color: palette.green800,
  },
});

