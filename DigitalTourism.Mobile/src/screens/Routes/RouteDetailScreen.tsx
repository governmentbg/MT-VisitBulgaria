import React, {useState, useCallback} from 'react';
import {
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {Box, Text, Icon} from '../../design';
import {useTheme} from '../../theme';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useRoute as useRouteQuery} from '../../hooks/queries/useRoutes';
import {
  useToggleStopVisited,
  useRemoveRouteStop,
} from '../../hooks/mutations/useRouteItems';
import {RouteItemCard} from './components/RouteItemCard';
import {RouteDaySection} from './components/RouteDaySection';
import {RouteDetailHeader} from './components/RouteDetailHeader';
import {RouteMapView} from './components/RouteMapView';
import {AddDestinationModal} from './components/AddDestinationModal';
import {RouteSettingsSheet} from './components/RouteSettingsSheet';
import {ConfirmDialog} from '../../design/ConfirmDialog';
import {navigateToDetail} from '../../utils/navigation';
import {useRouteComputedData, type DaySection} from './hooks/useRouteComputedData';
import {useRouteDragReorder, type DragListItem} from './hooks/useRouteDragReorder';
import type {RootStackScreenProps} from '../../navigation/types';
import type {RouteStop} from '../../models/Route';
import {styles} from './RouteDetailScreen.styles';

type Props = RootStackScreenProps<'RouteDetail'>;

type TabKey = 'list' | 'map';

export const RouteDetailScreen = ({route, navigation}: Props) => {
  const {id} = route.params;
  const {t} = useTranslation('routes');
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  // Data
  const {data: routeData, isLoading} = useRouteQuery(id);

  // Computed data from route
  const {visited, total, sections, dateRangeText} = useRouteComputedData(routeData);

  // Mutations
  const toggleVisitedMutation = useToggleStopVisited();
  const removeStopMutation = useRemoveRouteStop();

  // Drag & drop reordering
  const {flatDragItems, dragResetKey, handleDragEnd} = useRouteDragReorder({
    routeId: id,
    routeData,
  });

  // UI state
  const [activeTab, setActiveTab] = useState<TabKey>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [settingsSheetVisible, setSettingsSheetVisible] = useState(false);
  const [focusLocation, setFocusLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [visitedConfirmStop, setVisitedConfirmStop] = useState<RouteStop | null>(null);

  // --- Handlers ---

  const handleToggleEdit = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleToggleVisited = useCallback(
    (stop: RouteStop) => {
      setVisitedConfirmStop(stop);
    },
    [],
  );

  const handleConfirmVisited = useCallback(() => {
    if (!visitedConfirmStop) return;
    const newVisited = !visitedConfirmStop.visited;
    toggleVisitedMutation.mutate(
      {routeId: id, stopId: visitedConfirmStop.id, visited: newVisited},
    );
    setVisitedConfirmStop(null);
  }, [visitedConfirmStop, id, toggleVisitedMutation]);

  const [deleteConfirmStop, setDeleteConfirmStop] = useState<RouteStop | null>(null);

  const handleDeleteStop = useCallback(
    (stop: RouteStop) => {
      setDeleteConfirmStop(stop);
    },
    [],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteConfirmStop) return;
    removeStopMutation.mutate({
      routeId: id,
      experienceType: deleteConfirmStop.experienceType,
      experienceId: deleteConfirmStop.experienceId,
    });
    setDeleteConfirmStop(null);
  }, [deleteConfirmStop, id, removeStopMutation]);

  const handleOpenDetail = useCallback(
    (stop: RouteStop) => {
      navigateToDetail(navigation, stop.experienceType, String(stop.experienceId));
    },
    [navigation],
  );

  const handleShowOnMap = useCallback((stop: RouteStop) => {
    if (stop.location?.latitude != null && stop.location?.longitude != null) {
      setFocusLocation({latitude: stop.location.latitude, longitude: stop.location.longitude});
      setActiveTab('map');
    }
  }, []);

  const handleTabChange = useCallback((tab: TabKey) => {
    if (tab === 'map') setFocusLocation(null);
    setActiveTab(tab);
  }, []);

  // --- Render helpers ---

  const renderSectionHeader = useCallback(
    ({section}: {section: DaySection}) => (
      <Box paddingHorizontal="m" paddingTop="m" paddingBottom="xs">
        <RouteDaySection
          dayNumber={section.dayNumber}
          destinationCount={section.data.length}
        />
      </Box>
    ),
    [],
  );

  const renderItem = useCallback(
    ({item}: {item: RouteStop}) => (
      <RouteItemCard
        stop={item}
        isEditing={isEditing}
        onPress={() => handleOpenDetail(item)}
        onNavigate={() => handleShowOnMap(item)}
        onDelete={() => handleDeleteStop(item)}
        onToggleVisited={() => handleToggleVisited(item)}
      />
    ),
    [isEditing, handleOpenDetail, handleShowOnMap, handleDeleteStop, handleToggleVisited],
  );

  const renderDraggableItem = useCallback(
    ({item, drag, isActive}: RenderItemParams<DragListItem>) => {
      if (item.type === 'header') {
        return (
          <Box paddingHorizontal="m" paddingTop="m" paddingBottom="xs">
            <RouteDaySection
              dayNumber={item.dayNumber}
              destinationCount={item.stopCount}
            />
          </Box>
        );
      }
      return (
        <RouteItemCard
          stop={item.stop}
          isEditing={true}
          onPress={() => {}}
          onNavigate={() => handleShowOnMap(item.stop)}
          onDelete={() => handleDeleteStop(item.stop)}
          onToggleVisited={() => handleToggleVisited(item.stop)}
          drag={drag}
          isActive={isActive}
        />
      );
    },
    [handleShowOnMap, handleDeleteStop, handleToggleVisited],
  );

  // --- Loading state ---

  if (isLoading) {
    return (
      <Box flex={1} backgroundColor="mainBackground">
        <Box
          style={[styles.headerContainer, {paddingTop: insets.top + moderateScale(12)}]}
          backgroundColor="mainBackground">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityLabel={t('back', {defaultValue: 'Go back'})}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon source="chevron-left" size={moderateScale(32)} color="textPrimary" />
          </TouchableOpacity>
        </Box>
        <Box flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Box>
      </Box>
    );
  }

  if (!routeData) {
    return (
      <Box flex={1} backgroundColor="mainBackground">
        <Box
          style={[styles.headerContainer, {paddingTop: insets.top + moderateScale(12)}]}
          backgroundColor="mainBackground">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityLabel={t('back', {defaultValue: 'Go back'})}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon source="chevron-left" size={moderateScale(32)} color="textPrimary" />
          </TouchableOpacity>
        </Box>
        <Box flex={1} alignItems="center" justifyContent="center" padding="xl">
          <Text variant="body" color="textSecondary" style={styles.centerText}>
            {t('routeNotFound')}
          </Text>
        </Box>
      </Box>
    );
  }

  // --- Main render ---

  return (
    <Box flex={1} backgroundColor="surfaceBackground">
      <RouteDetailHeader
        name={routeData.name}
        dateRangeText={dateRangeText}
        visited={visited}
        total={total}
        activeTab={activeTab}
        isEditing={isEditing}
        onGoBack={() => navigation.goBack()}
        onToggleEdit={handleToggleEdit}
        onEditSettings={() => setSettingsSheetVisible(true)}
        onTabChange={handleTabChange}
      />

      {/* Content */}
      {activeTab === 'list' ? (
        isEditing ? (
          <View style={styles.flex}>
            {/* Edit mode instruction */}
            <Text style={[styles.editInstruction, {fontFamily: fonts.regular}]}>
              {t('dragToReorder')}
            </Text>

            {/* Single unified draggable list — supports cross-day reordering */}
            <DraggableFlatList
              key={dragResetKey}
              data={flatDragItems}
              keyExtractor={item => item.key}
              renderItem={renderDraggableItem}
              onDragEnd={handleDragEnd}
              contentContainerStyle={styles.dragListContent}
            />
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={
              <Box
                flex={1}
                alignItems="center"
                justifyContent="center"
                padding="xl">
                <Text
                  variant="body"
                  color="textSecondary"
                  style={styles.centerText}>
                  {t('emptyRoute')}
                </Text>
              </Box>
            }
          />
        )
      ) : (
        <RouteMapView
          days={routeData.days}
          focusLocation={focusLocation}
          onMarkerPress={handleOpenDetail}
        />
      )}

      {/* FAB - Add destination */}
      <TouchableOpacity
        onPress={() => setAddModalVisible(true)}
        activeOpacity={0.8}
        accessibilityLabel={t('addDestination')}
        style={[styles.fab, {bottom: insets.bottom + moderateScale(16)}]}>
        <Icon source="plus" size={moderateScale(24)} color={palette.white} />
      </TouchableOpacity>

      {/* Add Destination Modal */}
      <AddDestinationModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        routeId={id}
        days={routeData.days}
      />

      {/* Edit route settings (name + dates) */}
      <RouteSettingsSheet
        visible={settingsSheetVisible}
        onDismiss={() => setSettingsSheetVisible(false)}
        route={routeData}
      />

      <ConfirmDialog
        visible={!!visitedConfirmStop}
        onDismiss={() => setVisitedConfirmStop(null)}
        icon={visitedConfirmStop?.visited ? 'close-circle-outline' : 'check-circle-outline'}
        title={visitedConfirmStop?.visited
          ? t('markAsUnvisited')
          : t('markAsVisited')}
        message={visitedConfirmStop?.name ?? ''}
        actions={[
          {
            label: t('cancel'),
            onPress: () => setVisitedConfirmStop(null),
            variant: 'cancel',
          },
          {
            label: visitedConfirmStop?.visited
              ? t('markAsUnvisited')
              : t('markAsVisited'),
            onPress: handleConfirmVisited,
            variant: 'default',
          },
        ]}
      />

      <ConfirmDialog
        visible={!!deleteConfirmStop}
        onDismiss={() => setDeleteConfirmStop(null)}
        icon="trash-can-outline"
        title={t('deleteStopTitle', {defaultValue: 'Remove stop?'})}
        message={deleteConfirmStop?.name ?? ''}
        actions={[
          {
            label: t('cancel'),
            onPress: () => setDeleteConfirmStop(null),
            variant: 'cancel',
          },
          {
            label: t('delete'),
            onPress: handleConfirmDelete,
            variant: 'danger',
          },
        ]}
      />
    </Box>
  );
};

