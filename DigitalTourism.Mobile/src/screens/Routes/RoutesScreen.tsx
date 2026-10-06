import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  NativeModules,
  Share,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {EmptyState} from '../../components/shared/EmptyState';
import {ErrorState} from '../../components/shared/ErrorState';
import {SignedOutState} from '../../components/shared/SignedOutState';
import {HeaderProfileButton} from '../../components/shared/HeaderProfileButton';
import {Box, Text, Icon} from '../../design';
import {useTheme} from '../../theme';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {useRoutes} from '../../hooks/queries/useRoutes';
import {useDeleteRoute} from '../../hooks/mutations/useDeleteRoute';
import {useDownloadRoutePdf} from '../../hooks/mutations/useRouteItems';
import {useAuth} from '../../contexts/AuthContext';
import {useAlert} from '../../contexts/AlertContext';
import {ConfirmDialog} from '../../design/ConfirmDialog';
import {RouteCard} from './components/RouteCard';
import type {Route} from '../../models/Route';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';
import {BAR_HEIGHT} from '../../navigation/CustomTabBar';
import {palette} from '../../theme/palette';

export const RoutesScreen = () => {
  const {t} = useTranslation('routes');
  const {t: tCommon} = useTranslation('common');
  const {t: tErrors} = useTranslation('errors');
  const {alert} = useAlert();
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {isAuthenticated, isLoading: isAuthLoading, login} = useAuth();
  const {data: routes, isLoading, isError, refetch, isRefetching} = useRoutes();
  const deleteMutation = useDeleteRoute();
  const downloadMutation = useDownloadRoutePdf();
  const {i18n} = useTranslation();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);

  const handlePress = useCallback(
    (route: Route) => {
      navigation.navigate('RouteDetail', {id: route.id});
    },
    [navigation],
  );

  const handleDownload = useCallback(
    (route: Route) => {
      downloadMutation.mutate(
        {routeId: route.id, locale: i18n.language},
        {
          onSuccess: async (filePath) => {
            try {
              if (Platform.OS === 'ios') {
                await Share.share({url: `file://${filePath}`});
              } else {
                ToastAndroid.show(t('downloadSuccess'), ToastAndroid.SHORT);
                await NativeModules.FileOpener.open(filePath, 'application/pdf');
              }
            } catch {
              alert(t('downloadSuccess'), '');
            }
          },
          onError: () => {
            alert(t('downloadError'), '');
          },
        },
      );
    },
    [downloadMutation, i18n.language, t, alert],
  );

  const handleDeleteRequest = useCallback((route: Route) => {
    setRouteToDelete(route);
    setDeleteDialogVisible(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (routeToDelete) {
      deleteMutation.mutate(routeToDelete.id);
    }
    setDeleteDialogVisible(false);
    setRouteToDelete(null);
  }, [routeToDelete, deleteMutation]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogVisible(false);
    setRouteToDelete(null);
  }, []);

  const handleCreate = useCallback(() => {
    navigation.navigate('CreateRoute');
  }, [navigation]);

  const handleEdit = useCallback(
    (route: Route) => {
      navigation.navigate('CreateRoute', {
        routeId: route.id,
        name: route.name,
        startDate: route.startDate,
        duration: route.duration,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item}: {item: Route}) => (
      <RouteCard
        route={item}
        onPress={() => handlePress(item)}
        onEdit={() => handleEdit(item)}
        onDownload={() => handleDownload(item)}
        onDelete={() => handleDeleteRequest(item)}
      />
    ),
    [handlePress, handleEdit, handleDownload, handleDeleteRequest],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return null;
    }

    return (
      <EmptyState
        icon="compass-outline"
        title={t('emptyTitle')}
        subtitle={t('emptyDescription')}
        actionLabel={t('createNew')}
        onAction={handleCreate}
      />
    );
  }, [isLoading, t, handleCreate]);

  const renderHeader = useCallback(() => (
    <Box
      backgroundColor="mainBackground"
      paddingHorizontal="m"
      paddingBottom="s"
      style={[styles.header, {paddingTop: insets.top + moderateScale(16)}]}>
      <Box
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="space-between"
        marginBottom="s">
        <Box flex={1} paddingRight="s">
          <Text
            fontFamily={fonts.bold}
            color="textHeading"
            style={styles.heading}>
            {t('title')}
          </Text>
          <Text variant="body" color="textSecondary" marginTop="xs">
            {t('subtitle')}
          </Text>
        </Box>
        <HeaderProfileButton />
      </Box>
    </Box>
  ), [insets.top, t]);

  // Auth loading state
  if (isAuthLoading) {
    return (
      <Box flex={1} backgroundColor="surfaceBackground">
        <Box flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Box>
      </Box>
    );
  }

  // Auth guard: not authenticated
  if (!isAuthenticated) {
    return (
      <Box flex={1} backgroundColor="surfaceBackground">
        <SignedOutState
          icon="navigation-variant-outline"
          title={tCommon('auth.welcomeTitle')}
          description={tCommon('auth.welcomeMessage')}
          actionLabel={tCommon('auth.login')}
          onAction={login}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          backgroundColor="mainBackground"
          paddingHorizontal="m"
          paddingBottom="s"
          style={[styles.header, {paddingTop: insets.top + moderateScale(16)}]}>
          <Box
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="space-between"
            marginBottom="s">
            <Box flex={1} paddingRight="s">
              <Text
                fontFamily={fonts.bold}
                color="textHeading"
                style={styles.heading}>
                {t('title')}
              </Text>
              <Text variant="body" color="textSecondary" marginTop="xs">
                {t('subtitle')}
              </Text>
            </Box>
            <HeaderProfileButton />
          </Box>
        </Box>
      </Box>
    );
  }

  const routesList = routes ?? [];

  return (
    <Box flex={1} backgroundColor="surfaceBackground">
      {renderHeader()}

      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Box>
      ) : isError ? (
        <ErrorState
          title={tErrors('screen.title')}
          subtitle={tErrors('screen.subtitle')}
          retryLabel={tErrors('screen.retry')}
          onRetry={refetch}
        />
      ) : (
        <FlatList
          data={routesList}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom:
                BAR_HEIGHT +
                insets.bottom +
                moderateScale(48) +
                moderateScale(24),
            },
            routesList.length === 0 && styles.listEmpty,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      {/* FAB - Create new route */}
      {routesList.length > 0 && (
        <TouchableOpacity
          onPress={handleCreate}
          activeOpacity={0.8}
          accessibilityLabel={t('createNew')}
          style={[
            styles.fab,
            {bottom: BAR_HEIGHT + insets.bottom + moderateScale(16)},
          ]}>
          <Icon source="plus" size={moderateScale(24)} color={palette.white} />
        </TouchableOpacity>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        visible={deleteDialogVisible}
        onDismiss={handleDeleteCancel}
        title={t('deleteConfirmTitle')}
        message={t('deleteConfirmMessage')}
        icon="trash-can-outline"
        actions={[
          {
            label: t('cancel'),
            onPress: handleDeleteCancel,
            variant: 'cancel',
          },
          {
            label: t('delete'),
            onPress: handleDeleteConfirm,
            variant: 'danger',
          },
        ]}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
  },
  heading: {
    fontSize: moderateScale(32),
    lineHeight: moderateScale(32 * 1.2),
  },
  list: {
    paddingTop: moderateScale(16),
  },
  listEmpty: {
    flexGrow: 1,
  },
  centerText: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: moderateScale(16),
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: palette.green700,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});
