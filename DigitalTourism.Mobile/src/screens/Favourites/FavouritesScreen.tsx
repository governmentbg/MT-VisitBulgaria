import React, {useState, useMemo, useCallback, useRef} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextInput as RNTextInput} from 'react-native';
import {Box, Text, Icon} from '../../design';
import {useTheme} from '../../theme';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useFavourites} from '../../hooks/queries/useFavourites';
import {useFavouriteRemoveWithConfirm} from '../../hooks/useFavouriteToggle';
import {useCollapsibleHeader} from '../../hooks/useCollapsibleHeader';
import {CACHE_TIMES} from '../../constants';
import {FavouriteCard} from '../../components/favourites/FavouriteCard';
import {FilterChip, ClearFilterChip} from '../../components/filters';
import type {FavouriteItem, FavouriteExperienceType} from '../../models/Favourite';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';
import {TYPE_EMOJI} from '../../constants';
import {navigateToDetail} from '../../utils/navigation';
import {EmptyState} from '../../components/shared/EmptyState';
import {ErrorState} from '../../components/shared/ErrorState';
import {SignedOutState} from '../../components/shared/SignedOutState';
import {HeaderProfileButton} from '../../components/shared/HeaderProfileButton';
import {useAuth} from '../../contexts/AuthContext';

const TITLE_SECTION_HEIGHT =
  moderateScale(16) + // paddingTop
  moderateScale(32 * 1.2) + // heading lineHeight
  moderateScale(8) + // subtitle marginTop (s)
  moderateScale(24); // subtitle body lineHeight

const SEARCH_BAR_HEIGHT = moderateScale(48);
const SEARCH_ROW_HEIGHT =
  moderateScale(8) + // marginTop
  SEARCH_BAR_HEIGHT +
  moderateScale(8); // marginBottom

const CHIPS_SECTION_HEIGHT = moderateScale(40); // chip height

const HEADER_PADDING_BOTTOM_EXPANDED = moderateScale(8);
const HEADER_PADDING_BOTTOM_COLLAPSED = moderateScale(16);

type FilterType = FavouriteExperienceType | 'all';

interface FilterChipOption {
  key: FilterType;
  label: string;
  emoji: string;
}

const FILTER_CHIPS: Omit<FilterChipOption, 'label'>[] = [
  {key: 'events', emoji: TYPE_EMOJI.event},
  {key: 'hotels', emoji: TYPE_EMOJI.hotel},
  {key: 'attractions', emoji: TYPE_EMOJI.attraction},
  {key: 'restaurants', emoji: TYPE_EMOJI.restaurant},
  {key: 'activities', emoji: TYPE_EMOJI.activity},
];

export const FavouritesScreen = () => {
  const {t} = useTranslation('favourites');
  const {t: tErrors} = useTranslation('errors');
  const {t: tCommon} = useTranslation('common');
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {isAuthenticated, isLoading: isAuthLoading, login} = useAuth();
  const {data: favourites, isLoading, isError, refetch, isRefetching, dataUpdatedAt} = useFavourites(isAuthenticated);
  const {requestRemove, confirmDialog: favouriteConfirmDialog, isRemoving, removingId} =
    useFavouriteRemoveWithConfirm();

  // Refetch favourites on focus only if data is stale
  useFocusEffect(
    useCallback(() => {
      if (!dataUpdatedAt || Date.now() - dataUpdatedAt > CACHE_TIMES.SHORT) {
        refetch();
      }
    }, [refetch, dataUpdatedAt]),
  );

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collapsible header
  const listRef = useRef<Animated.FlatList<FavouriteItem>>(null);
  const fullHeaderHeight =
    insets.top +
    TITLE_SECTION_HEIGHT +
    SEARCH_ROW_HEIGHT +
    CHIPS_SECTION_HEIGHT +
    HEADER_PADDING_BOTTOM_EXPANDED;
  const collapsedHeaderHeight =
    insets.top + SEARCH_ROW_HEIGHT + HEADER_PADDING_BOTTOM_COLLAPSED;

  const {
    scrollHandler,
    headerAnimatedStyle,
    titleAnimatedStyle,
    chipsAnimatedStyle,
  } = useCollapsibleHeader({
    fullHeight: fullHeaderHeight,
    collapsedHeight: collapsedHeaderHeight,
    titleSectionHeight: TITLE_SECTION_HEIGHT,
    chipsSectionHeight: CHIPS_SECTION_HEIGHT,
    paddingExpanded: HEADER_PADDING_BOTTOM_EXPANDED,
    paddingCollapsed: HEADER_PADDING_BOTTOM_COLLAPSED,
  });

  // Types that exist in the user's favourites
  const availableTypes = useMemo(() => {
    if (!favourites) return new Set<string>();
    return new Set(favourites.map(f => f.type));
  }, [favourites]);

  // Build filter chips — only show types that exist in favourites
  const filterChips = useMemo<FilterChipOption[]>(
    () =>
      FILTER_CHIPS
        .filter(chip => availableTypes.has(chip.key))
        .map(chip => ({
          ...chip,
          label: t(`type${chip.key.charAt(0).toUpperCase()}${chip.key.slice(1)}`),
        })),
    [t, availableTypes],
  );

  // Filter and search
  const filteredFavourites = useMemo(() => {
    if (!favourites) return [];

    let result = favourites;

    // Type filter
    if (activeFilter !== 'all') {
      result = result.filter(f => f.type === activeFilter);
    }

    // Search filter
    if (searchQuery.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        f =>
          f.title.toLowerCase().includes(query) ||
          f.cityName?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [favourites, activeFilter, searchQuery]);

  const handleUnfavourite = useCallback(
    (item: FavouriteItem) => {
      requestRemove(item);
    },
    [requestRemove],
  );

  const handlePress = useCallback(
    (item: FavouriteItem) => {
      // Extract numeric ID from composite key: `{relationTo}_{numericId}`
      const numericId = item.id.split('_').pop()!;
      navigateToDetail(navigation, item.type, numericId);
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item}: {item: FavouriteItem}) => (
      <Box paddingHorizontal="m" marginBottom="m">
        <FavouriteCard
          item={item}
          onPress={() => handlePress(item)}
          onUnfavourite={() => handleUnfavourite(item)}
          isRemoving={isRemoving && removingId === item.favouriteId}
        />
      </Box>
    ),
    [handlePress, handleUnfavourite, isRemoving, removingId],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;

    // Has favourites but filters match nothing
    if (favourites && favourites.length > 0) {
      return (
        <Box flex={1} alignItems="center" justifyContent="center" padding="xl">
          <Text
            variant="caption"
            color="textSecondary"
            marginBottom="s"
            style={styles.centerText}>
            {t('noResults')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            activeOpacity={0.7}>
            <Text
              fontFamily={fonts.bold}
              color="primary"
              style={styles.clearFilters}>
              {t('clearFilters')}
            </Text>
          </TouchableOpacity>
        </Box>
      );
    }

    // No favourites at all
    return (
      <EmptyState
        icon="heart-outline"
        title={t('emptyTitle')}
        subtitle={t('emptyDescription')}
        actionLabel={t('emptyAction')}
        onAction={() => navigation.navigate('Main', {screen: 'Explore'})}
      />
    );
  }, [isLoading, favourites, t, navigation]);

  const listContentContainerStyle = useMemo(
    () => [
      styles.list,
      {paddingTop: fullHeaderHeight + moderateScale(8)},
      filteredFavourites.length === 0 && styles.listEmpty,
    ],
    [fullHeaderHeight, filteredFavourites.length],
  );

  const emptyContentStyle = useMemo(
    () => ({paddingTop: fullHeaderHeight + moderateScale(16), flex: 1}),
    [fullHeaderHeight],
  );

  if (isAuthLoading) {
    return (
      <Box flex={1} backgroundColor="surfaceBackground" alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box flex={1} backgroundColor="surfaceBackground">
        <SignedOutState
          icon="heart-outline"
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
          style={[styles.staticHeader, {paddingTop: insets.top + moderateScale(16)}]}>
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
              <Text variant="body" color="textSecondary" marginTop="s">
                {t('subtitle')}
              </Text>
            </Box>
            <HeaderProfileButton />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="surfaceBackground">
      {isLoading ? (
        <Box style={emptyContentStyle} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Box>
      ) : isError ? (
        <Box style={emptyContentStyle}>
          <ErrorState
            title={tErrors('screen.title')}
            subtitle={tErrors('screen.subtitle')}
            retryLabel={tErrors('screen.retry')}
            onRetry={refetch}
          />
        </Box>
      ) : (
        <Animated.FlatList
          ref={listRef}
          data={filteredFavourites}
          keyExtractor={(item: FavouriteItem) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={5}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={listContentContainerStyle}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              progressViewOffset={fullHeaderHeight}
            />
          }
        />
      )}

      {/* Collapsible header — absolute, so height changes don't re-layout the list */}
      <Animated.View
        style={[
          styles.header,
          {paddingTop: insets.top},
          headerAnimatedStyle,
        ]}>
        {/* Collapsible: Title & subtitle + profile button */}
        <Animated.View style={[styles.titleSection, titleAnimatedStyle]}>
          <Box
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="space-between">
            <Box flex={1} paddingRight="s">
              <Text
                fontFamily={fonts.bold}
                color="textHeading"
                style={styles.heading}>
                {t('title')}
              </Text>
              <Text variant="body" color="textSecondary" marginTop="s">
                {t('subtitle')}
              </Text>
            </Box>
            <HeaderProfileButton />
          </Box>
        </Animated.View>

        {/* Static: Search bar */}
        <Box
          backgroundColor="mainBackground"
          borderRadius="full"
          flexDirection="row"
          alignItems="center"
          paddingHorizontal="m"
          height={SEARCH_BAR_HEIGHT}
          style={styles.searchBar}>
          <Icon source="magnify" size="s" color="textTertiary" />
          <RNTextInput
            placeholder={t('search')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor={theme.colors.textTertiary}
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              activeOpacity={0.7}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Icon source="close-circle" size={moderateScale(18)} color="textTertiary" />
            </TouchableOpacity>
          )}
        </Box>

        {/* Collapsible: Filter chips */}
        <Animated.View style={chipsAnimatedStyle}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}>
            {filterChips.map(chip => {
              const isActive = activeFilter === chip.key;
              return (
                <FilterChip
                  key={chip.key}
                  emoji={chip.emoji}
                  label={chip.label}
                  isActive={isActive}
                  onPress={() =>
                    setActiveFilter(prev =>
                      prev === chip.key ? 'all' : chip.key,
                    )
                  }
                />
              );
            })}
            {activeFilter !== 'all' && (
              <ClearFilterChip onPress={() => setActiveFilter('all')} />
            )}
          </ScrollView>
        </Animated.View>
      </Animated.View>

      {favouriteConfirmDialog}
    </Box>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: palette.white,
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
    overflow: 'hidden',
  },
  staticHeader: {
    backgroundColor: palette.white,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
  },
  titleSection: {
    paddingTop: moderateScale(16),
    overflow: 'hidden',
  },
  heading: {
    fontSize: moderateScale(32),
    lineHeight: moderateScale(32 * 1.2),
  },
  searchBar: {
    marginTop: moderateScale(8),
    marginBottom: moderateScale(8),
    shadowColor: palette.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: fonts.regular,
    color: palette.black,
    marginLeft: moderateScale(8),
    padding: 0,
  },
  chipsContainer: {
    gap: moderateScale(8),
  },
  list: {
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(100),
  },
  listEmpty: {
    flexGrow: 1,
  },
  centerText: {
    textAlign: 'center',
  },
  clearFilters: {
    fontSize: moderateScale(14),
  },
});
