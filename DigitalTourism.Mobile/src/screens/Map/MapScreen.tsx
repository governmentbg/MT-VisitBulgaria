import React, {useState, useMemo, useCallback, useRef, useEffect} from 'react';
import {BackHandler, Platform} from 'react-native';
import {useWindowDimensions, Linking} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RESULTS} from 'react-native-permissions';
import {useTranslation} from 'react-i18next';
import {useAlert} from '../../contexts/AlertContext';
import {useTheme} from '../../theme';
import {Box} from '../../design';
import {mapStyle} from '../../design/mapStyles';
import FilterIcon from '../../assets/icons/filter.svg';
import NavigationIcon from '../../assets/icons/navigation.svg';
import {useCities} from '../../hooks/queries/useCities';
import {useMapSearch} from '../../hooks/queries/useMapSearch';
import {useSearch} from '../../hooks/queries/useSearch';
import {
  useThrottledRegion,
  useLocationPermission,
  useUserLocation,
} from '../../hooks';
import type {CityCluster} from '../../hooks/useCityClusters';
import {ConfirmDialog} from '../../design/ConfirmDialog';
import {MapMarker} from '../../components/map/MapMarker';
import {CityMapMarker} from '../../components/map/CityMapMarker';
import {CustomCluster} from '../../components/map/CustomCluster';
import {SearchBarOverlay} from '../../components/map/SearchBarOverlay';
import {
  MapSegmentedControl,
  type MapViewMode,
} from '../../components/map/MapSegmentedControl';
import {MapFab} from '../../components/map/MapFab';
import {NearbyChip} from '../../components/map/NearbyChip';
import {NearbyBottomSheet} from '../../components/map/NearbyBottomSheet';
import {MapListView} from '../../components/map/MapListView';
import {MapListFiltersModal, emptyMapListFilters} from '../../components/map/MapListFiltersModal';
import type {MapListFilters} from '../../components/map/MapListFiltersModal';
import type {SearchSuggestion} from '../../components/map/SearchBarOverlay';
import {calculateZoomLevel, isInBulgaria} from '../../utils/mapHelpers';
import {navigateToDetail} from '../../utils/navigation';
import {hitToMapItem} from '../../utils/searchHitTransforms';
import {useSearchFacets} from '../../hooks/queries/useSearch';
import {useMapDataTransforms} from './hooks/useMapDataTransforms';
import type {SearchFilters} from '../../services/api/types/searchTypes';
import {Clusterer, isClusterFeature, type Supercluster} from 'react-native-clusterer';
import {moderateScale} from '../../theme/scaling';
import type {MapItem} from '../../types/map';
import type {RootStackParamList} from '../../navigation/types';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {styles, BULGARIA_BOUNDS, DEFAULT_REGION} from './MapScreen.styles';

const NEARBY_RADIUS_KM = 2;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MapScreen = () => {
  const {isDark} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const {t} = useTranslation('map');
  const {t: tErrors} = useTranslation('errors');
  const {alert} = useAlert();
  const [viewMode, setViewMode] = useState<MapViewMode>('map');
  const [nearbySheetVisible, setNearbySheetVisible] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [mapFilters, setMapFilters] = useState<MapListFilters>(emptyMapListFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [exitDialogVisible, setExitDialogVisible] = useState(false);

  // Android back button: close any open sheet instead of exiting the app
  // Only active when this screen is focused (doesn't block back on detail screens)
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!navigation.isFocused()) return false;
      if (nearbySheetVisible) {
        setNearbySheetVisible(false);
        return true;
      }
      if (showFiltersModal) {
        setShowFiltersModal(false);
        return true;
      }
      // No sheet open — show exit confirmation dialog
      setExitDialogVisible(true);
      return true;
    });
    return () => handler.remove();
  }, [navigation, nearbySheetVisible, showFiltersModal]);

  // Location permission and geolocation
  const {
    permissionStatus,
    hasPromptedOnOpen,
    checkPermission,
    requestPermission,
    markPrompted,
  } = useLocationPermission();
  const {getCurrentPosition, userLocation} = useUserLocation();

  // Fetch user location on mount (for distance display)
  useEffect(() => {
    getCurrentPosition().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only: get initial position once
  }, []);

  // Debounced zoom-based region updates for efficient map interaction
  const {
    region: currentRegion,
    tileZoom: currentZoom,
    handleRegionChange,
    handleRegionChangeComplete,
  } = useThrottledRegion({
    minZoom: 5,
    maxZoom: 18,
    debounceMs: 500,
  });

  const zoomLevel = calculateZoomLevel(currentZoom);

  // Set map boundaries after map loads
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setMapBoundaries(
        BULGARIA_BOUNDS.northEast,
        BULGARIA_BOUNDS.southWest,
      );
    }
  }, []);

  // On first open: request location permission and zoom to user's position
  useEffect(() => {
    const initLocation = async () => {
      let status = await checkPermission();

      // Prompt for permission if not yet decided
      if (!hasPromptedOnOpen) {
        if (status === RESULTS.DENIED) {
          status = await requestPermission();
        }
        markPrompted();
      }

      // If granted, zoom to user's location at street level
      if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
        try {
          const pos = await getCurrentPosition();
          if (isInBulgaria(pos.latitude, pos.longitude)) {
            mapRef.current?.animateToRegion(
              {
                latitude: pos.latitude,
                longitude: pos.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              800,
            );
          }
        } catch {
          // Silently fall back to default region
        }
      }
    };

    initLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only: permission check and initial location setup runs once
  }, []);

  // ── Typesense geo-search: replaces 5 collection hooks ──
  // Shared filter state → SearchFilters for Typesense
  const searchFilters = useMemo((): SearchFilters | undefined => {
    const singularMap: Record<string, string> = {
      attractions: 'attraction', events: 'event', hotels: 'hotel',
      restaurants: 'restaurant', activities: 'activity',
    };
    const f: SearchFilters = {};
    if (mapFilters.type.length > 0) f.type = mapFilters.type.map(v => singularMap[v] || v);
    if (mapFilters.categories.length > 0) f.categories = mapFilters.categories;
    if (mapFilters.cities.length > 0) f.city = mapFilters.cities;
    if (mapFilters.municipality.length > 0) f.municipality = mapFilters.municipality;
    if (mapFilters.region.length > 0) f.region = mapFilters.region;
    if (mapFilters.starRating.length > 0) f.starRating = mapFilters.starRating.map(Number);
    if (mapFilters.amenities.length > 0) f.amenities = mapFilters.amenities;
    if (mapFilters.cuisineType.length > 0) f.cuisineType = mapFilters.cuisineType;
    if (mapFilters.dietaryOptions.length > 0) f.dietaryOptions = mapFilters.dietaryOptions;
    if (mapFilters.difficultyLevel.length > 0) f.difficultyLevel = mapFilters.difficultyLevel;
    if (mapFilters.seasonality.length > 0) f.seasonality = mapFilters.seasonality;
    if (mapFilters.organizer.length > 0) f.organizer = mapFilters.organizer;
    return Object.keys(f).length > 0 ? f : undefined;
  }, [mapFilters]);

  const activeFilterCount = useMemo(
    () => Object.values(mapFilters).reduce((sum, arr) => sum + arr.length, 0),
    [mapFilters],
  );

  // Facets for filter modal
  const {data: facetsResult} = useSearchFacets();
  const facets = useMemo(() => facetsResult?.facets ?? {}, [facetsResult]);

  const {data: mapData, isError: isMapError} = useMapSearch({
    region: currentRegion,
    zoom: currentZoom,
    filters: searchFilters,
    query: searchQuery || undefined,
  });

  // Show alert when map data fails to load
  useEffect(() => {
    if (isMapError) {
      alert(tErrors('screen.title'), tErrors('screen.subtitle'));
    }
  }, [isMapError, tErrors, alert]);

  // Keep cities for city marker coordinates (Typesense gives name+count, not coords)
  const {data: cities} = useCities();

  // Transform map data into renderable formats
  const {cityClusters, mapMarkers, markerFeatures} = useMapDataTransforms({
    mapData,
    cities,
  });

  // Nearby: 2km radius from map center, sorted by distance (Typesense geo-search)
  // Only enabled when we have a valid region to center the radius on
  const nearbySearch = useSearch(
    currentRegion
      ? {
          query: '*',
          filters: {
            ...(searchFilters || {}),
            geoRadius: {
              lat: currentRegion.latitude,
              lng: currentRegion.longitude,
              radiusKm: NEARBY_RADIUS_KM,
            },
          },
          geoSort: {
            lat: currentRegion.latitude,
            lng: currentRegion.longitude,
          },
          perPage: 50,
        }
      : {},
  );

  const nearbyItems = useMemo<MapItem[]>(() => {
    if (!nearbySearch.data?.hits) return [];
    return nearbySearch.data.hits.map(hit => {
      const mapped = hitToMapItem(hit);
      return {
        ...mapped,
        cityId: mapped.cityName,
      };
    });
  }, [nearbySearch.data]);

  // Handle marker press — navigate directly to detail screen
  const handleMarkerPress = useCallback((item: MapItem) => {
    const parts = item.id.split('_');
    const numericId = parts.length > 1 ? parts[parts.length - 1] : item.id;
    navigateToDetail(navigation, item.__source, numericId);
  }, [navigation]);

  const handleViewDetails = useCallback(
    (item: MapItem) => {
      const parts = item.id.split('_');
      const numericId = parts.length > 1 ? parts[parts.length - 1] : item.id;
      navigateToDetail(navigation, item.__source, numericId);
    },
    [navigation],
  );

  // Zoom to a city when tapping a city pin
  const handleZoomToCity = useCallback((cluster: CityCluster) => {
    mapRef.current?.animateToRegion(
      {
        latitude: cluster.coordinates.latitude,
        longitude: cluster.coordinates.longitude,
        latitudeDelta: 0.05, // ~zoom 13
        longitudeDelta: 0.05,
      },
      500,
    );
  }, []);

  const animateToPosition = useCallback(async () => {
    try {
      const pos = await getCurrentPosition();
      if (!isInBulgaria(pos.latitude, pos.longitude)) {
        alert(t('locationOutsideBulgaria'), t('locationOutsideBulgariaMessage'));
        return;
      }
      mapRef.current?.animateToRegion(
        {
          latitude: pos.latitude,
          longitude: pos.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      );
    } catch {
      alert(t('locationError'), t('locationErrorMessage'));
    }
  }, [getCurrentPosition, t, alert]);

  const handleLocateMe = useCallback(async () => {
    const status = await checkPermission();

    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      await animateToPosition();
      return;
    }

    if (status === RESULTS.DENIED) {
      const newStatus = await requestPermission();
      if (newStatus === RESULTS.GRANTED || newStatus === RESULTS.LIMITED) {
        await animateToPosition();
      }
      return;
    }

    if (status === RESULTS.BLOCKED) {
      alert(
        t('locationPermissionTitle'),
        t('locationPermissionBlocked'),
        {
          actions: [
            {label: t('common:buttons.cancel'), variant: 'cancel'},
            {label: t('openSettings'), onPress: () => Linking.openSettings()},
          ],
        },
      );
    }
  }, [checkPermission, requestPermission, animateToPosition, t, alert]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  /** Navigate to the detail screen for a search suggestion, or zoom to its location */
  const handleSuggestionPress = useCallback(
    (suggestion: SearchSuggestion) => {
      // Clear search
      setSearchQuery('');

      // Zoom the map to the selected suggestion
      if (suggestion.location) {
        const [lat, lng] = suggestion.location;
        mapRef.current?.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          500,
        );
      }
    },
    [],
  );

  // Extracted renderItem for Clusterer to avoid inline closure re-creation
  const renderClustererItem = useCallback(
    (item: Supercluster.PointOrClusterFeature<MapItem, Supercluster.AnyProps>) => {
      if (isClusterFeature(item)) {
        return (
          <Marker
            key={`cluster-${item.properties.cluster_id}`}
            tracksViewChanges={false}
            coordinate={{
              latitude: item.geometry.coordinates[1],
              longitude: item.geometry.coordinates[0],
            }}
            onPress={() => {
              const expansionRegion =
                item.properties.getExpansionRegion();
              mapRef.current?.animateToRegion(
                expansionRegion,
                500,
              );
            }}>
            <CustomCluster
              count={item.properties.point_count}
            />
          </Marker>
        );
      } else {
        const mapItem = item.properties as MapItem;
        return (
          <MapMarker
            key={mapItem.id}
            item={mapItem}
            zoomLevel={zoomLevel}
            onPress={(marker) => handleMarkerPress(marker as MapItem)}
          />
        );
      }
    },
    [zoomLevel, handleMarkerPress],
  );

  const handleFilter = useCallback(() => {
    setShowFiltersModal(true);
  }, []);

  const locationGranted =
    permissionStatus === RESULTS.GRANTED ||
    permissionStatus === RESULTS.LIMITED;

  const sharedModals = (
    <>
      <MapListFiltersModal
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        filters={mapFilters}
        onFiltersChange={setMapFilters}
        facets={facets}
      />
      {Platform.OS === 'android' && (
        <ConfirmDialog
          visible={exitDialogVisible}
          onDismiss={() => setExitDialogVisible(false)}
          icon="exit-run"
          title={t('exitAppTitle', {defaultValue: 'Exit app?'})}
          message={t('exitAppMessage', {defaultValue: 'Are you sure you want to exit the application?'})}
          actions={[
            {
              label: t('cancel', {defaultValue: 'Cancel'}),
              onPress: () => setExitDialogVisible(false),
              variant: 'cancel',
            },
            {
              label: t('exit', {defaultValue: 'Exit'}),
              onPress: () => {
                setExitDialogVisible(false);
                setTimeout(() => BackHandler.exitApp(), 100);
              },
              variant: 'danger',
            },
          ]}
        />
      )}
    </>
  );

  // List view: show scrollable card list
  if (viewMode === 'list') {
    return (
      <>
      <MapListView
        items={mapMarkers}
        viewMode={viewMode}
        onModeChange={setViewMode}
        onItemPress={handleViewDetails}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSuggestionPress={handleSuggestionPress}
        filters={mapFilters}
        onFiltersChange={setMapFilters}
        filterCount={activeFilterCount}
        onFilterPress={handleFilter}
        facets={facets}
        userLocation={userLocation}
      />
      {sharedModals}
      </>
    );
  }

  // Map view
  return (
    <Box flex={1}>
      <MapView
        ref={mapRef}
        key={isDark ? 'map-dark' : 'map-light'}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        maxZoomLevel={20}
        minZoomLevel={7}
        toolbarEnabled={false}
        showsUserLocation={locationGranted}
        showsMyLocationButton={false}
        onRegionChange={handleRegionChange}
        onRegionChangeComplete={handleRegionChangeComplete}>
        {zoomLevel === 'country'
          ? // Country level: city cluster pins
            cityClusters.map(cluster => (
              <CityMapMarker
                key={`city-${cluster.cityId}`}
                cluster={cluster}
                onPress={() => handleZoomToCity(cluster)}
              />
            ))
          : // City level: individual attraction/event markers with clustering
            <Clusterer
              data={markerFeatures}
              region={currentRegion ?? DEFAULT_REGION}
              options={{
                radius: 30,
                minPoints: 2,
              }}
              mapDimensions={{width, height}}
              renderItem={renderClustererItem}
            />
        }
      </MapView>

      {/* Search bar overlay with autocomplete */}
      <SearchBarOverlay
        query={searchQuery}
        onChangeQuery={handleSearchChange}
        onSuggestionPress={handleSuggestionPress}
        userLocation={userLocation}
        mapCenter={currentRegion}
      />

      {/* Map/List segmented control */}
      <MapSegmentedControl
        activeMode={viewMode}
        onModeChange={setViewMode}
      />

      {/* Filter button - top right, aligned with segmented control */}
      <Box
        position="absolute"
        right={0}
        paddingHorizontal="m"
        style={{top: insets.top + moderateScale(64)}}>
        <MapFab
          svgIcon={FilterIcon}
          size="small"
          onPress={handleFilter}
          badge={activeFilterCount}
          accessibilityLabel={t('filters')}
        />
      </Box>

      {/* Nearby chip - bottom center, visible at city zoom level */}
      {zoomLevel === 'city' && !nearbySheetVisible && (
        <Box
          position="absolute"
          left={0}
          right={0}
          alignItems="center"
          style={{bottom: moderateScale(100)}}>
          <NearbyChip
            count={nearbyItems.length}
            onPress={() => setNearbySheetVisible(true)}
          />
        </Box>
      )}

      {/* Locate me button - bottom right */}
      <Box
        position="absolute"
        right={0}
        paddingHorizontal="m"
        style={{bottom: moderateScale(100)}}>
        <MapFab
          svgIcon={NavigationIcon}
          size="small"
          onPress={handleLocateMe}
          accessibilityLabel={t('locateMe', {defaultValue: 'My location'})}
        />
      </Box>

      <NearbyBottomSheet
        visible={nearbySheetVisible}
        items={nearbyItems}
        onClose={() => setNearbySheetVisible(false)}
        onItemPress={item => {
          setNearbySheetVisible(false);
          handleViewDetails(item);
        }}
      />

      {sharedModals}
    </Box>
  );
};
