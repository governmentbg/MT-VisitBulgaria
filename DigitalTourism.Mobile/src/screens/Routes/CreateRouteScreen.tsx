import React, {useState, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Box, Text, Icon} from '../../design';
import {useTheme} from '../../theme';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useCreateRoute} from '../../hooks/mutations/useCreateRoute';
import {useUpdateRoute} from '../../hooks/mutations/useUpdateRoute';
import {RouteDatePicker} from './components/RouteDatePicker';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';
import {formatDateRange} from '../../utils/dateHelpers';

export const CreateRouteScreen = () => {
  const {t, i18n} = useTranslation('routes');
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CreateRoute'>>();
  const editParams = route.params;
  const isEdit = typeof editParams?.routeId === 'number';
  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();

  const [name, setName] = useState(editParams?.name ?? '');
  const [startDate, setStartDate] = useState<string | null>(
    editParams?.startDate ?? null,
  );
  const [duration, setDuration] = useState<number | null>(
    editParams?.duration ?? null,
  );
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const isValid = name.trim().length > 0 && startDate !== null && duration !== null;

  const dateDisplayText = useMemo(() => {
    if (startDate && duration) {
      return formatDateRange(startDate, duration, i18n.language);
    }
    return '';
  }, [startDate, duration, i18n.language]);

  const handleDateConfirm = useCallback(
    (selectedStartDate: string, selectedDuration: number) => {
      setStartDate(selectedStartDate);
      setDuration(selectedDuration);
      setDatePickerVisible(false);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    if (!isValid || !startDate || !duration) {
      return;
    }
    if (isEdit && editParams?.routeId != null) {
      updateRoute.mutate(
        {
          id: editParams.routeId,
          updates: {name: name.trim(), startDate, duration},
        },
        {
          onSuccess: () => {
            navigation.goBack();
          },
        },
      );
      return;
    }
    createRoute.mutate(
      {name: name.trim(), startDate, duration},
      {
        onSuccess: newRoute => {
          navigation.replace('RouteDetail', {id: newRoute.id});
        },
      },
    );
  }, [
    isValid,
    name,
    startDate,
    duration,
    isEdit,
    editParams?.routeId,
    createRoute,
    updateRoute,
    navigation,
  ]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Box flex={1} backgroundColor="surfaceBackground">
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        {/* Header */}
        <Box
          backgroundColor="mainBackground"
          paddingHorizontal="m"
          paddingBottom="m"
          style={[styles.header, {paddingTop: insets.top + moderateScale(12)}]}>
          <Box flexDirection="row" alignItems="center">
            <TouchableOpacity
              onPress={handleCancel}
              activeOpacity={0.7}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
              <Icon source="chevron-left" size="l" color="textPrimary" />
            </TouchableOpacity>
          </Box>
          <Text
            fontFamily={fonts.bold}
            color="textHeading"
            style={styles.heading}
            marginTop="s">
            {isEdit ? t('editTitle') : t('createTitle')}
          </Text>
        </Box>

        {/* Form */}
        <Box flex={1} padding="m">
          {/* Route name field */}
          <Box marginBottom="l">
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
              placeholderTextColor={theme.colors.textTertiary}
              value={name}
              onChangeText={setName}
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
              autoCapitalize="sentences"
              returnKeyType="done"
            />
          </Box>

          {/* Dates field */}
          <Box marginBottom="l">
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
        </Box>

        {/* Bottom buttons */}
        <Box
          paddingHorizontal="m"
          style={[styles.bottomButtons, {paddingBottom: insets.bottom + moderateScale(16)}]}>
          <TouchableOpacity
            activeOpacity={isValid ? 0.8 : 1}
            disabled={
              !isValid || createRoute.isPending || updateRoute.isPending
            }
            onPress={handleSubmit}>
            <Box
              height={moderateScale(48)}
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
              style={isValid ? styles.createButton : styles.createButtonDisabled}>
              <Text
                fontFamily={fonts.bold}
                style={[
                  styles.createButtonText,
                  !isValid && styles.createButtonTextDisabled,
                ]}>
                {isEdit ? t('save') : t('createNew')}
              </Text>
            </Box>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handleCancel}>
            <Box
              height={moderateScale(48)}
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
              style={styles.cancelButton}
              marginTop="s">
              <Text fontFamily={fonts.bold} style={styles.cancelButtonText}>
                {t('cancel')}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </KeyboardAvoidingView>

      {/* Date picker bottom sheet */}
      <RouteDatePicker
        visible={datePickerVisible}
        onDismiss={() => setDatePickerVisible(false)}
        onConfirm={handleDateConfirm}
        initialStartDate={startDate ?? undefined}
        initialDuration={duration ?? undefined}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
  },
  heading: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
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
  bottomButtons: {
    paddingTop: moderateScale(12),
    gap: moderateScale(12),
  },
  createButton: {
    backgroundColor: palette.green700,
  },
  createButtonDisabled: {
    backgroundColor: palette.gray200,
  },
  createButtonText: {
    fontSize: moderateScale(16),
    color: palette.white,
  },
  createButtonTextDisabled: {
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
