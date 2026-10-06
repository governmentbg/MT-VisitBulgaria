import React, {useState} from 'react';
import {ActivityIndicator, Alert, Image, Linking, StyleSheet, TouchableOpacity} from 'react-native';
import Config from 'react-native-config';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';
import {SafeAreaView} from '../../design/SafeAreaView';
import {ScrollView} from '../../design/ScrollView';
import {Box} from '../../design/Box';
import {Text} from '../../design/Text';
import {Icon, type IconName} from '../../design/Icon';
import UserIcon from '../../../assets/icons/user.svg';
import {Modal} from '../../design/Modal';
import {ConfirmDialog} from '../../design/ConfirmDialog';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../theme';
import {palette} from '../../theme/palette';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {ProfileMenuItem} from './ProfileMenuItem';
import {LanguageSelector} from '../Settings/components/LanguageSelector';
import {getLegalPages} from '../../services/api/settingsApi';
import {version as appVersion} from '../../../package.json';

const WEB_BASE_URL = (Config.WEB_BASE_URL || 'https://visitbulgaria.com').replace(/\/$/, '');

export function ProfileScreen() {
  const {isAuthenticated, isLoading, user, login, logoutUser, changePassword} = useAuth();
  const {t, i18n} = useTranslation('profile');
  const {t: tCommon} = useTranslation('common');
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  const handleChangePassword = async () => {
    // changePassword handles its own errors (including user cancellation
    // of the in-app browser) and returns a boolean. No alert on failure:
    // Keycloak surfaces any real update-password errors inside its own UI.
    await changePassword();
  };

  const handleOpenPrivacyPolicy = async () => {
    if (privacyLoading) return;
    setPrivacyLoading(true);
    try {
      const legal = await getLegalPages(i18n.language);
      const path = legal.privacyPolicyPath;
      if (!path) {
        Alert.alert(t('privacySafety'), t('privacySafetyUnavailable'));
        return;
      }
      const url = `${WEB_BASE_URL}/${legal.locale}${path.startsWith('/') ? path : `/${path}`}`;
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(t('privacySafety'), t('privacySafetyUnavailable'));
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      if (__DEV__) {
        console.debug('[Profile] Failed to resolve privacy policy URL:', error);
      }
      Alert.alert(t('privacySafety'), t('privacySafetyUnavailable'));
    } finally {
      setPrivacyLoading(false);
    }
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogVisible(false);
    await logoutUser();
    navigation.navigate('Main', {screen: 'Explore', params: undefined});
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Box>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    const benefits: {icon: IconName; label: string}[] = [
      {icon: 'heart-outline', label: t('benefitFavorites')},
      {icon: 'navigation-variant-outline', label: t('benefitWebRoutes')},
      {icon: 'map-marker-path', label: t('benefitSuggestions')},
    ];
    return (
      <Box flex={1} backgroundColor="surfaceBackground">
        {/* Body — centered on full screen */}
        <Box flex={1} justifyContent="center" paddingHorizontal="m">
          <Text
            fontFamily={fonts.bold}
            color="textHeading"
            marginBottom="s"
            style={styles.guestBodyTitle}>
            {t('signedOutTitle')}
          </Text>
          <Text variant="body" color="textSecondary" marginBottom="l">
            {t('signedOutDescription')}
          </Text>

          <Box marginBottom="l">
            {benefits.map(benefit => (
              <Box
                key={benefit.icon}
                flexDirection="row"
                alignItems="center"
                paddingVertical="s">
                <Box
                  width={moderateScale(36)}
                  height={moderateScale(36)}
                  borderRadius="full"
                  backgroundColor="primaryLight"
                  alignItems="center"
                  justifyContent="center">
                  <Icon source={benefit.icon} size={moderateScale(20)} color="primary" />
                </Box>
                <Text
                  variant="body"
                  color="textPrimary"
                  marginLeft="m"
                  flex={1}>
                  {benefit.label}
                </Text>
              </Box>
            ))}
          </Box>

          <TouchableOpacity onPress={login} activeOpacity={0.7}>
            <Box
              backgroundColor="primary"
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
              style={styles.signInButton}>
              <Text
                fontFamily={fonts.bold}
                color="textOnPrimary"
                style={styles.signInButtonText}>
                {t('signIn')}
              </Text>
            </Box>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.guestCloseButton}>
            <Box
              backgroundColor="surfaceBackground"
              borderRadius="full"
              borderWidth={1}
              borderColor="border"
              alignItems="center"
              justifyContent="center"
              style={styles.signInButton}>
              <Text variant="button" color="textPrimary">
                {tCommon('buttons.close')}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>

        {/* Header — absolute, white, extends into status bar */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          backgroundColor="mainBackground"
          paddingHorizontal="m"
          paddingBottom="m"
          style={[styles.guestHeader, {paddingTop: insets.top + moderateScale(16)}]}>
          <Box flexDirection="row" alignItems="center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
              accessibilityRole="button"
              accessibilityLabel={tCommon('buttons.back')}
              style={styles.backButton}>
              <Icon source="chevron-left" size="l" color="textPrimary" />
            </TouchableOpacity>
            <Box
              width={moderateScale(64)}
              height={moderateScale(64)}
              borderRadius="full"
              backgroundColor="surfaceBackground"
              alignItems="center"
              justifyContent="center">
              <UserIcon width={moderateScale(22)} height={moderateScale(26)} />
            </Box>
            <Box marginLeft="m" flex={1}>
              <Text
                fontFamily={fonts.bold}
                color="textPrimary"
                style={styles.guestName}>
                {t('guestName')}
              </Text>
              <Text
                variant="caption"
                color="textPrimary"
                marginTop="xs">
                {t('guestSubtitle')}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const displayName = user?.name || user?.preferred_username;
  const displayEmail = user?.email;
  const avatarUri = user?.picture?.startsWith('https://') ? user.picture : undefined;

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.surfaceBackground}]}>
      <ScrollView>
        {/* Header */}
        <Box
          backgroundColor="mainBackground"
          paddingHorizontal="m"
          paddingTop="l"
          paddingBottom="m"
          style={styles.header}>
          <Box flexDirection="row" alignItems="center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
              accessibilityRole="button"
              accessibilityLabel={tCommon('buttons.back')}
              style={styles.backButton}>
              <Icon source="chevron-left" size="l" color="textPrimary" />
            </TouchableOpacity>
            {avatarUri ? (
              <Image
                source={{uri: avatarUri}}
                style={styles.avatar}
              />
            ) : (
              <Box
                width={64}
                height={64}
                borderRadius="full"
                backgroundColor="surfaceBackground"
                alignItems="center"
                justifyContent="center">
                <UserIcon width={moderateScale(22)} height={moderateScale(26)} />
              </Box>
            )}
            <Box marginLeft="m" flex={1}>
              {displayName && (
                <Text variant="title">{displayName}</Text>
              )}
              {displayEmail && (
                <Text variant="body" color="textSecondary" marginTop="xs">
                  {displayEmail}
                </Text>
              )}
            </Box>
          </Box>
        </Box>

        {/* Menu items */}
        <Box
          backgroundColor="mainBackground"
          borderRadius="xl"
          marginHorizontal="m"
          marginTop="m">
          <ProfileMenuItem
            icon="account-edit-outline"
            label={t('editProfile')}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <ProfileMenuItem
            icon="lock-outline"
            label={t('changePassword')}
            onPress={handleChangePassword}
          />
          <ProfileMenuItem
            icon="translate"
            label={t('language')}
            onPress={() => setLanguageModalVisible(true)}
          />
          <ProfileMenuItem
            icon="shield-lock-outline"
            label={t('privacySafety')}
            onPress={handleOpenPrivacyPolicy}
          />
        </Box>

        {/* Logout button */}
        <Box marginHorizontal="m" marginTop="l">
          <TouchableOpacity
            onPress={() => setLogoutDialogVisible(true)}
            activeOpacity={0.7}>
            <Box
              height={48}
              backgroundColor="dangerLight"
              borderRadius="full"
              flexDirection="row"
              alignItems="center"
              justifyContent="center">
              <Icon source="logout" size="m" color="dangerDark" />
              <Text
                marginLeft="s"
                variant="button"
                style={{color: theme.colors.dangerDark}}>
                {t('logOut')}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>

        {/* Close button */}
        <Box marginHorizontal="m" marginTop="m">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Box
              height={48}
              backgroundColor="surfaceBackground"
              borderRadius="full"
              borderWidth={1}
              borderColor="border"
              flexDirection="row"
              alignItems="center"
              justifyContent="center">
              <Text variant="button" color="textPrimary">
                {tCommon('buttons.close')}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>

        {/* Version */}
        <Box marginTop="m" marginBottom="l" alignItems="center">
          <Text variant="small" color="textSecondary">
            {t('version', {version: appVersion})}
          </Text>
        </Box>
      </ScrollView>

      <Modal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        title={t('language')}>
        <Box paddingBottom="l">
          <LanguageSelector />
        </Box>
      </Modal>

      <ConfirmDialog
        visible={logoutDialogVisible}
        onDismiss={() => setLogoutDialogVisible(false)}
        icon="logout"
        title={t('logOutConfirmTitle')}
        message={t('logOutConfirmMessage')}
        actions={[
          {
            label: tCommon('actions.cancel'),
            onPress: () => setLogoutDialogVisible(false),
            variant: 'cancel',
          },
          {
            label: t('logOut'),
            onPress: handleLogoutConfirm,
            variant: 'danger',
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
  },
  backButton: {
    marginRight: moderateScale(8),
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  guestHeader: {
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
  },
  guestName: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
  },
  guestBodyTitle: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
  },
  signInButton: {
    height: moderateScale(48),
  },
  guestCloseButton: {
    marginTop: moderateScale(12),
  },
  signInButtonText: {
    fontSize: moderateScale(16),
  },
});
