import React, {useRef, useCallback} from 'react';
import {TouchableOpacity, TextInput, FlatList, ListRenderItemInfo} from 'react-native';
import {Box, Text, Icon} from '../../design';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale} from '../../theme/scaling';
import {useTranslation} from 'react-i18next';
import {useSearchSuggest} from '../../hooks/queries/useSearch';
import type {ExperienceSearchResult} from '../../services/api/types/searchTypes';
import {hitToSearchSuggestion, type SearchSuggestionItem} from '../../utils/searchHitTransforms';
import {SearchSuggestionItem as SuggestionItemComponent} from './SearchSuggestionItem';
import {styles} from './SearchBarOverlay.styles';

/** Suggestion item returned to the parent when a suggestion is tapped */
export type SearchSuggestion = SearchSuggestionItem;

interface SearchBarOverlayProps {
  /** Called when tapped in placeholder mode (no query/onChangeQuery) */
  onPress?: () => void;
  /** Current search query — when provided, renders as active text input */
  query?: string;
  /** Called when text changes — when provided, renders as active text input */
  onChangeQuery?: (text: string) => void;
  /** Called when a suggestion is tapped */
  onSuggestionPress?: (suggestion: SearchSuggestion) => void;
  /** When true, renders inline (not absolutely positioned). Used in list view header. */
  embedded?: boolean;
  /** User's current location for distance display */
  userLocation?: {latitude: number; longitude: number} | null;
  /** Map center for sorting results by proximity */
  mapCenter?: {latitude: number; longitude: number} | null;
}

/**
 * Pill-shaped search bar for the map screen.
 * Two modes:
 * - Placeholder: tappable pill (when no query/onChangeQuery provided)
 * - Active: real TextInput with clear button + autocomplete suggestions
 */
export function SearchBarOverlay({
  onPress,
  query,
  onChangeQuery,
  onSuggestionPress,
  embedded = false,
  userLocation,
  mapCenter,
}: SearchBarOverlayProps) {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation('map');
  const inputRef = useRef<TextInput>(null);

  const isActive = onChangeQuery != null;

  // Autocomplete suggestions from Typesense, sorted by proximity to map center
  const geoSort = mapCenter ? {lat: mapCenter.latitude, lng: mapCenter.longitude} : null;
  const {data: suggestData} = useSearchSuggest(query ?? '', geoSort);
  const suggestions = suggestData?.hits ?? [];
  const showSuggestions = isActive && (query?.length ?? 0) >= 2 && suggestions.length > 0;

  const handleSuggestionPress = useCallback(
    (hit: ExperienceSearchResult) => {
      const suggestion = hitToSearchSuggestion(hit);
      onChangeQuery?.('');
      onSuggestionPress?.(suggestion);
    },
    [onChangeQuery, onSuggestionPress],
  );

  const renderSuggestion = useCallback(
    ({item}: ListRenderItemInfo<ExperienceSearchResult>) => (
      <SuggestionItemComponent
        hit={item}
        userLocation={userLocation}
        onPress={handleSuggestionPress}
      />
    ),
    [handleSuggestionPress, userLocation],
  );

  const bar = isActive ? (
    <Box
      backgroundColor="mainBackground"
      borderRadius="full"
      flexDirection="row"
      alignItems="center"
      paddingHorizontal="m"
      height={moderateScale(48)}
      style={styles.container}>
      <Icon source="magnify" size={moderateScale(20)} color="textSecondary" />
      <TextInput
        ref={inputRef}
        value={query}
        onChangeText={onChangeQuery}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor="#898d8f"
        style={styles.input}
        autoCorrect={false}
        returnKeyType="search"
      />
      {query && query.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeQuery('')}
          activeOpacity={0.7}
          hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
          <Icon source="close-circle" size={moderateScale(18)} color="textSecondary" />
        </TouchableOpacity>
      )}
    </Box>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.touchable}>
      <Box
        backgroundColor="mainBackground"
        borderRadius="full"
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        height={moderateScale(48)}
        style={styles.container}>
        <Icon source="magnify" size={moderateScale(20)} color="textSecondary" />
        <Text
          variant="bodyMedium"
          color="textSecondary"
          marginLeft="s"
          flex={1}>
          {t('searchPlaceholder')}
        </Text>
      </Box>
    </TouchableOpacity>
  );

  const suggestionsDropdown = showSuggestions ? (
    <Box style={styles.suggestionsContainer}>
      <FlatList
        data={suggestions}
        renderItem={renderSuggestion}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        style={styles.suggestionsList}
      />
    </Box>
  ) : null;

  if (embedded) {
    return (
      <Box>
        {bar}
        {suggestionsDropdown}
      </Box>
    );
  }

  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      zIndex={20}
      style={{top: insets.top + moderateScale(8)}}
      paddingHorizontal="m"
      alignItems="center">
      {bar}
      {suggestionsDropdown}
    </Box>
  );
}
