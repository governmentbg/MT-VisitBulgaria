/**
 * Detail Screen Factory
 *
 * Creates standardized detail screens for all entity types. Encapsulates:
 * favourite toggle, nearby filtering, analytics, navigate, share, DetailLayout.
 *
 * Each entity provides a config + content component with type-specific UI.
 */

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Linking, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFavouriteToggle} from '../../hooks/useFavouriteToggle';
import {useShareSheet} from '../../hooks/useShareSheet';
import {DetailLayout} from '../../components/detail';
import {ShareSheet} from '../../components/share/ShareSheet';
import {ShareCardCapture} from '../../components/share/ShareCardCapture';
import type {DetailContentProps} from '../../components/detail/content/DetailContentBase';
import {navigateToDetail, pushDetail} from '../../utils/navigation';
import {analytics} from '../../services/analytics';
import type {BaseEntity} from '../../models/BaseEntity';
import {computeSimilarItems} from '../../utils/mapHelpers';
import {useNearbyExperiences} from '../../hooks/queries/useNearbyExperiences';
import type {FavouriteExperienceType} from '../../models/Favourite';
import type {RootStackParamList} from '../../navigation/types';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AddToRouteSheet} from '../Routes/components/AddToRouteSheet';
import {useAuth} from '../../contexts/AuthContext';
import type {RouteExperienceType} from '../../models/Route';

/** Route names that point to entity detail screens (all have {id: string} params). */
type DetailRouteName = 'AttractionDetail' | 'EventDetail' | 'HotelDetail' | 'RestaurantDetail' | 'ActivityDetail';

export interface DetailScreenConfig<T extends BaseEntity> {
  /** Plural collection slug for favourites: 'attractions', 'events', etc. */
  relationTo: FavouriteExperienceType;
  /** i18n namespace: 'attractions', 'events', etc. */
  i18nNamespace: string;
  /** Analytics type label: 'attraction', 'event', etc. */
  analyticsType: string;
  /** Navigation route name for push (nearby): 'AttractionDetail', etc. */
  detailRoute: DetailRouteName;
  /** Hook returning single entity query */
  useEntity: (id: string | undefined) => {
    data: T | undefined | null;
    isLoading: boolean;
    isError?: boolean;
    refetch?: () => void;
  };
  /** Hook returning all entities for nearby list */
  useAllEntities: () => {data: T[] | undefined};
  /** The content component rendered inside DetailLayout */
  ContentComponent: React.ComponentType<DetailContentProps<T>>;
}

export function createDetailScreen<T extends BaseEntity>(
  config: DetailScreenConfig<T>,
) {
  const {
    relationTo,
    i18nNamespace,
    analyticsType,
    detailRoute,
    useEntity,
    useAllEntities,
    ContentComponent,
  } = config;

  return function EntityDetailScreen({route, navigation}: NativeStackScreenProps<RootStackParamList, DetailRouteName>) {
    const {id} = route.params;

    const {t} = useTranslation(i18nNamespace);
    const {t: tCommon} = useTranslation('common');
    const {data: entity, isLoading, isError, refetch} = useEntity(id);
    const {data: allEntities = []} = useAllEntities();
    const {isFavourited, toggle: handleToggleFavourite, confirmDialog: favouriteConfirmDialog} =
      useFavouriteToggle(relationTo, id, entity?.name ?? '');
    const shareSheet = useShareSheet();
    const {isAuthenticated, login} = useAuth();
    const [addToRouteVisible, setAddToRouteVisible] = useState(false);

    const handleAddToRoute = useCallback(() => {
      if (!isAuthenticated) {
        login();
        return;
      }
      setAddToRouteVisible(true);
    }, [isAuthenticated, login]);

    const similarItems = useMemo(() => {
      if (!entity) return [];
      return computeSimilarItems(entity, allEntities);
    }, [entity, allEntities]);

    const {data: nearbyItems = []} = useNearbyExperiences(entity);

    useEffect(() => {
      if (entity) {
        analytics.trackExperienceView(
          String(entity.id),
          analyticsType,
          entity.cityName,
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- track only on entity ID change, not every entity property update
    }, [entity?.id]);

    const handleNavigate = useCallback(() => {
      if (!entity) return;
      const {latitude, longitude} = entity.location;
      const url = Platform.select({
        ios: `maps://app?daddr=${latitude},${longitude}`,
        android: `google.navigation:q=${latitude},${longitude}`,
      });
      if (url) Linking.openURL(url);
    }, [entity]);

    const handleShare = useCallback(() => {
      if (!entity) return;
      shareSheet.open(entity, analyticsType);
    }, [entity, shareSheet]);

    return (
      <>
      <DetailLayout
        images={entity?.images ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        notFound={!isLoading && !isError && !entity}
        notFoundTitle={t('notFound.title')}
        notFoundMessage={t('notFound.message')}
        onBack={() => navigation.goBack()}
        onHeart={isAuthenticated ? handleToggleFavourite : undefined}
        isFavourited={isFavourited}
        onShare={handleShare}
        primaryCta={{
          label: tCommon('navigate', {defaultValue: 'Navigate'}),
          onPress: handleNavigate,
        }}
        secondaryCta={
          isAuthenticated
            ? {
                label: tCommon('addToRoute', {defaultValue: 'Add to route'}),
                onPress: handleAddToRoute,
              }
            : undefined
        }>
        {entity && (
          <ContentComponent
            entity={entity}
            similarItems={similarItems}
            nearbyItems={nearbyItems}
            onNavigateToDetail={(type: string, itemId: string) =>
              navigateToDetail(navigation, type, itemId)
            }
            onPushNearby={(itemId: string, itemType?: string) => {
              if (itemType) {
                pushDetail(navigation, itemType, itemId);
              } else {
                navigation.push(detailRoute, {id: itemId});
              }
            }}
          />
        )}
      </DetailLayout>
      {entity && (
        <ShareCardCapture
          ref={shareSheet.shareCardRef}
          imageUrl={entity.images[0]}
          name={entity.name}
          cityName={entity.cityName}
        />
      )}
      <ShareSheet
        visible={shareSheet.visible}
        onClose={shareSheet.close}
        entity={shareSheet.capturedEntitySummary}
        onAction={shareSheet.handleAction}
      />
      {entity && isAuthenticated && (
        <AddToRouteSheet
          visible={addToRouteVisible}
          onClose={() => setAddToRouteVisible(false)}
          experienceType={relationTo as RouteExperienceType}
          experienceId={Number(entity.id)}
          experienceName={entity.name}
        />
      )}
      {favouriteConfirmDialog}
      </>
    );
  };
}
