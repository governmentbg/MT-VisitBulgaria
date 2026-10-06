import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Box, Text, Icon} from '../../design';
import {ScrollView} from '../../design/ScrollView';
import {ConfirmDialog} from '../../design/ConfirmDialog';
import {useTheme} from '../../theme';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useAuth} from '../../contexts/AuthContext';
import {useAlert} from '../../contexts/AlertContext';
import type {RootStackParamList} from '../../navigation/types';
import {DeleteAccountConfirmModal} from './DeleteAccountConfirmModal';

export function EditProfileScreen() {
  const {user, updateProfile, deleteAccount} = useAuth();
  const {t} = useTranslation('profile');
  const {t: tCommon} = useTranslation('common');
  const {alert} = useAlert();
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [firstName, setFirstName] = useState(user?.given_name || '');
  const [lastName, setLastName] = useState(user?.family_name || '');
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasChanges =
    firstName.trim() !== (user?.given_name || '') ||
    lastName.trim() !== (user?.family_name || '');

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;
  const canSave = hasChanges && isValid && !isSaving;

  const avatarUri = user?.picture?.startsWith('https://')
    ? user.picture
    : undefined;

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSave = useCallback(async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      alert(t('profileUpdated'), '');
      navigation.goBack();
    } catch (error) {
      console.error('[EditProfile] Update failed:', error);
      alert(t('profileUpdateError'), '');
    } finally {
      setIsSaving(false);
    }
  }, [canSave, firstName, lastName, updateProfile, alert, t, navigation]);

  const handleDeleteLinkPress = useCallback(() => {
    setWarningVisible(true);
  }, []);

  const handleWarningCancel = useCallback(() => {
    setWarningVisible(false);
  }, []);

  const handleWarningContinue = useCallback(() => {
    setWarningVisible(false);
    setConfirmVisible(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    if (isDeleting) return;
    setConfirmVisible(false);
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteAccount();
      setConfirmVisible(false);
      alert(t('accountDeleted'), '');
      navigation.reset({
        index: 0,
        routes: [{name: 'Main', params: {screen: 'Explore', params: undefined}}],
      });
    } catch (error) {
      console.error('[EditProfile] Account deletion failed:', error);
      alert(t('accountDeleteError'), '');
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, deleteAccount, alert, t, navigation]);

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
            <Text
              fontFamily={fonts.bold}
              color="textHeading"
              style={styles.heading}
              marginLeft="s">
              {t('editProfileTitle')}
            </Text>
          </Box>
        </Box>

        <ScrollView
          flex={1}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}>
          {/* Avatar */}
          <Box alignItems="center" marginBottom="l">
            {avatarUri ? (
              <Image source={{uri: avatarUri}} style={styles.avatar} />
            ) : (
              <Icon
                source="account-circle"
                size={moderateScale(96)}
                color="primary"
              />
            )}
          </Box>

          {/* First name */}
          <Box marginBottom="l">
            <Text
              fontFamily={fonts.bold}
              color="textHeading"
              style={styles.label}
              marginBottom="s">
              {t('firstName')}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                firstNameFocused && styles.textInputFocused,
              ]}
              placeholderTextColor={theme.colors.textTertiary}
              value={firstName}
              onChangeText={setFirstName}
              onFocus={() => setFirstNameFocused(true)}
              onBlur={() => setFirstNameFocused(false)}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </Box>

          {/* Last name */}
          <Box marginBottom="l">
            <Text
              fontFamily={fonts.bold}
              color="textHeading"
              style={styles.label}
              marginBottom="s">
              {t('lastName')}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                lastNameFocused && styles.textInputFocused,
              ]}
              placeholderTextColor={theme.colors.textTertiary}
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => setLastNameFocused(true)}
              onBlur={() => setLastNameFocused(false)}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </Box>

          {/* Email (read-only) */}
          <Box marginBottom="l">
            <Text
              fontFamily={fonts.bold}
              color="textHeading"
              style={styles.label}
              marginBottom="s">
              {t('email')}
            </Text>
            <Box
              flexDirection="row"
              alignItems="center"
              style={styles.readOnlyField}>
              <Icon
                source="email-outline"
                size="m"
                color="textTertiary"
              />
              <Text
                style={styles.readOnlyText}
                color="textSecondary"
                numberOfLines={1}>
                {user?.email || ''}
              </Text>
            </Box>
          </Box>

          {/* Danger zone — permanent account deletion */}
          <Box style={styles.dangerDivider} marginBottom="l" />
          <Box marginBottom="l">
            <Text
              variant="caption"
              color="textSecondary"
              marginBottom="s">
              {t('deleteAccountCaption')}
            </Text>
            <TouchableOpacity
              onPress={handleDeleteLinkPress}
              activeOpacity={0.6}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Text
                fontFamily={fonts.bold}
                style={[
                  styles.deleteLink,
                  {color: theme.colors.dangerDark},
                ]}>
                {t('deleteAccountLinkLabel')}
              </Text>
            </TouchableOpacity>
          </Box>
        </ScrollView>

        {/* Bottom buttons */}
        <Box
          paddingHorizontal="m"
          style={[
            styles.bottomButtons,
            {paddingBottom: insets.bottom + moderateScale(16)},
          ]}>
          <TouchableOpacity
            activeOpacity={canSave ? 0.8 : 1}
            disabled={!canSave}
            onPress={handleSave}>
            <Box
              height={moderateScale(48)}
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
              style={canSave ? styles.saveButton : styles.saveButtonDisabled}>
              {isSaving ? (
                <ActivityIndicator size="small" color={palette.white} />
              ) : (
                <Text
                  fontFamily={fonts.bold}
                  style={[
                    styles.saveButtonText,
                    !canSave && styles.saveButtonTextDisabled,
                  ]}>
                  {t('saveChanges')}
                </Text>
              )}
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
                {tCommon('actions.cancel')}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={warningVisible}
        onDismiss={handleWarningCancel}
        icon="alert-octagon-outline"
        title={t('deleteAccountWarningTitle')}
        message={[
          t('deleteAccountConsequence1'),
          t('deleteAccountConsequence2'),
          t('deleteAccountConsequence3'),
          t('deleteAccountConsequence4'),
        ].join('\n\n')}
        actions={[
          {
            label: tCommon('actions.cancel'),
            onPress: handleWarningCancel,
            variant: 'cancel',
          },
          {
            label: t('deleteAccountContinue'),
            onPress: handleWarningContinue,
            variant: 'danger',
          },
        ]}
      />

      <DeleteAccountConfirmModal
        visible={confirmVisible}
        onDismiss={handleConfirmCancel}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        requiredKeyword={t('deleteAccountConfirmKeyword')}
        title={t('deleteAccountConfirmTitle')}
        prompt={t('deleteAccountConfirmPrompt')}
        placeholder={t('deleteAccountConfirmPlaceholder')}
        confirmLabel={t('deleteAccountCta')}
        cancelLabel={tCommon('actions.cancel')}
      />
    </Box>
  );
}

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
  scrollContent: {
    padding: moderateScale(16),
    paddingTop: moderateScale(24),
  },
  avatar: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: moderateScale(48),
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
  dangerDivider: {
    height: 1,
    backgroundColor: palette.gray100,
  },
  deleteLink: {
    fontSize: moderateScale(15),
    textDecorationLine: 'underline',
  },
  readOnlyField: {
    height: moderateScale(48),
    borderWidth: 1,
    borderColor: palette.gray100,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    backgroundColor: palette.gray50,
    gap: moderateScale(8),
  },
  readOnlyText: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: fonts.regular,
  },
  bottomButtons: {
    paddingTop: moderateScale(12),
    gap: moderateScale(12),
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
