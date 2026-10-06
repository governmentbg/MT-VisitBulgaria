import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, TouchableOpacity, Linking, Platform, StyleSheet} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';
import type {Location} from '../../models/Location';
import type {FavouriteExperienceType} from '../../models/Favourite';
import type {BaseEntity} from '../../models/BaseEntity';
import type {DetailContentProps} from '../detail/content/DetailContentBase';
import {Box, Icon} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {bottomSheetStyles} from '../../theme/bottomSheet';
import {useBottomSheetBackdrop} from '../../hooks/useBottomSheetBackdrop';
import {navigateToDetail, pushDetail} from '../../utils/navigation';
import {computeSimilarItems} from '../../utils/mapHelpers';
import {useNearbyExperiences} from '../../hooks/queries/useNearbyExperiences';
import {useFavouriteToggle} from '../../hooks/useFavouriteToggle';

// Data hooks
import {useAttraction, useAttractions} from '../../hooks/queries/useAttractions';
import {useEvent, useActiveEvents} from '../../hooks/queries/useEvents';
import {useActivity, useActivities} from '../../hooks/queries/useActivities';
import {useHotel, useHotels} from '../../hooks/queries/useHotels';
import {useRestaurant, useRestaurants} from '../../hooks/queries/useRestaurants';

// Detail components (reused from detail screens)
import {DetailHeroCarousel} from '../detail/DetailHeroCarousel';
import {DetailBottomCTAs} from '../detail/DetailBottomCTAs';
import {DetailSkeleton} from '../detail/DetailSkeleton';
import {AttractionDetailContent} from '../detail/content/AttractionDetailContent';
import {EventDetailContent} from '../detail/content/EventDetailContent';
import {ActivityDetailContent} from '../detail/content/ActivityDetailContent';
import {HotelDetailContent} from '../detail/content/HotelDetailContent';
import {RestaurantDetailContent} from '../detail/content/RestaurantDetailContent';

// ---------------------------------------------------------------------------
// Shared hooks for all sheet detail types
// ---------------------------------------------------------------------------

function useSheetNavigate(location: Location | undefined) {
  return useCallback(() => {
    if (!location) return;
    const url = Platform.select({
      ios: `maps://app?daddr=${location.latitude},${location.longitude}`,
      android: `google.navigation:q=${location.latitude},${location.longitude}`,
    });
    if (url) Linking.openURL(url).catch(err => { if (__DEV__) console.warn('[MarkerDetails] Failed to open navigation URL:', err); });
  }, [location]);
}

// ---------------------------------------------------------------------------
// Sheet content factory — eliminates per-type wrapper duplication
// ---------------------------------------------------------------------------

interface SheetContentProps {
  id: string;
  onClose: () => void;
}

interface SheetContentConfig<T extends BaseEntity> {
  relationTo: FavouriteExperienceType;
  detailRoute: string;
  useEntity: (id: string) => {data: T | undefined | null; isLoading: boolean};
  useAllEntities: () => {data: T[] | undefined};
  ContentComponent: React.ComponentType<DetailContentProps<T>>;
  secondaryCtaKey?: string;
}

function createSheetContent<T extends BaseEntity>(
  config: SheetContentConfig<T>,
) {
  const {
    relationTo,
    detailRoute,
    useEntity,
    useAllEntities,
    ContentComponent,
    secondaryCtaKey = 'addToRoute',
  } = config;

  return function SheetContent({id, onClose}: SheetContentProps) {
    const {t: tCommon} = useTranslation('common');
    const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const {data: entity, isLoading} = useEntity(id);
    const {data: allEntities = []} = useAllEntities();
    const {isFavourited, toggle: handleFavourite, confirmDialog: favouriteConfirmDialog} =
      useFavouriteToggle(relationTo, id, entity?.name ?? '');
    const handleNavigate = useSheetNavigate(entity?.location);

    const similarItems = useMemo(() => {
      if (!entity) return [];
      return computeSimilarItems(entity, allEntities);
    }, [entity, allEntities]);

    const {data: nearbyItems = []} = useNearbyExperiences(entity);

    if (isLoading) return <DetailSkeleton />;
    if (!entity) return null;

    return (
      <>
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          <View>
            <DetailHeroCarousel images={entity.images} />
            {/* Favourite heart button on hero image */}
            <TouchableOpacity
              onPress={handleFavourite}
              activeOpacity={0.7}
              style={styles.heartButton}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              accessibilityLabel={
                isFavourited
                  ? tCommon('actions.removeFromFavourites')
                  : tCommon('actions.addToFavourites')
              }
              accessibilityRole="button">
              <Box
                width={moderateScale(36)}
                height={moderateScale(36)}
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
                style={{backgroundColor: palette.green50}}>
                <Icon
                  source={isFavourited ? 'heart' : 'heart-outline'}
                  size={moderateScale(18)}
                  color={palette.green700}
                />
              </Box>
            </TouchableOpacity>
          </View>
          <Box paddingHorizontal="m" paddingTop="m">
            <ContentComponent
              entity={entity}
              similarItems={similarItems}
              nearbyItems={nearbyItems}
              onNavigateToDetail={(type, itemId) => {
                onClose();
                navigateToDetail(navigation, type, itemId);
              }}
              onPushNearby={(itemId, itemType) => {
                onClose();
                if (itemType) {
                  pushDetail(navigation, itemType, itemId);
                } else {
                  navigation.push(detailRoute as any, {id: itemId});
                }
              }}
            />
          </Box>
        </BottomSheetScrollView>
        <DetailBottomCTAs
          primaryLabel={tCommon('navigate', {defaultValue: 'Navigate'})}
          primaryOnPress={handleNavigate}
          secondaryLabel={tCommon(secondaryCtaKey, {
            defaultValue:
              secondaryCtaKey === 'addToList'
                ? 'Add to list'
                : 'Add to route',
          })}
          secondaryOnPress={handleFavourite}
        />
        {favouriteConfirmDialog}
      </>
    );
  };
}

// ---------------------------------------------------------------------------
// Per-type sheet content via factory
// ---------------------------------------------------------------------------

const SheetAttractionDetail = createSheetContent({
  relationTo: 'attractions',
  detailRoute: 'AttractionDetail',
  useEntity: useAttraction,
  useAllEntities: useAttractions,
  ContentComponent: AttractionDetailContent,
});

const SheetEventDetail = createSheetContent({
  relationTo: 'events',
  detailRoute: 'EventDetail',
  useEntity: useEvent,
  useAllEntities: useActiveEvents,
  ContentComponent: EventDetailContent,
  secondaryCtaKey: 'addToList',
});

const SheetActivityDetail = createSheetContent({
  relationTo: 'activities',
  detailRoute: 'ActivityDetail',
  useEntity: useActivity,
  useAllEntities: useActivities,
  ContentComponent: ActivityDetailContent,
});

const SheetHotelDetail = createSheetContent({
  relationTo: 'hotels',
  detailRoute: 'HotelDetail',
  useEntity: useHotel,
  useAllEntities: useHotels,
  ContentComponent: HotelDetailContent,
});

const SheetRestaurantDetail = createSheetContent({
  relationTo: 'restaurants',
  detailRoute: 'RestaurantDetail',
  useEntity: useRestaurant,
  useAllEntities: useRestaurants,
  ContentComponent: RestaurantDetailContent,
});

// ---------------------------------------------------------------------------
// Source -> wrapper map
// ---------------------------------------------------------------------------

const SHEET_COMPONENTS: Record<string, React.ComponentType<SheetContentProps>> = {
  attraction: SheetAttractionDetail,
  attractions: SheetAttractionDetail,
  event: SheetEventDetail,
  events: SheetEventDetail,
  activity: SheetActivityDetail,
  activities: SheetActivityDetail,
  hotel: SheetHotelDetail,
  hotels: SheetHotelDetail,
  restaurant: SheetRestaurantDetail,
  restaurants: SheetRestaurantDetail,
};

// ---------------------------------------------------------------------------
// Main bottom sheet component
// ---------------------------------------------------------------------------

interface MapItem {
  id: string;
  __source: string;
}

interface MarkerDetailsBottomSheetProps {
  item: MapItem | null;
  onClose: () => void;
}

export function MarkerDetailsBottomSheet({
  item,
  onClose,
}: MarkerDetailsBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['92%'], []);
  const renderBackdrop = useBottomSheetBackdrop();

  useEffect(() => {
    if (item) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [item]);

  const SheetContent = item ? SHEET_COMPONENTS[item.__source] : undefined;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}>
      {item && SheetContent && (
        <View style={styles.container}>
          <SheetContent
            id={item.id.includes('_') ? item.id.split('_').pop()! : item.id}
            onClose={onClose}
          />
        </View>
      )}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: bottomSheetStyles.sheetBackground,
  handleIndicator: bottomSheetStyles.handleIndicator,
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: moderateScale(120),
  },
  heartButton: {
    position: 'absolute',
    right: moderateScale(16),
    top: moderateScale(16),
    zIndex: 1,
  },
});
