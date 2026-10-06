import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Box, Text, Image} from '../../design';
import {useTranslation} from 'react-i18next';
import {fonts} from '../../theme/fonts';
import type {ExperienceSearchResult} from '../../services/api/types/searchTypes';
import {resolveMediaUrl} from '../../services/api/transforms/payloadHelpers';
import {TYPE_EMOJI} from '../../constants';
import {haversineDistanceMeters, formatDistance} from '../../utils/mapHelpers';
import {styles} from './SearchBarOverlay.styles';

interface SearchSuggestionItemProps {
  hit: ExperienceSearchResult;
  userLocation?: {latitude: number; longitude: number} | null;
  onPress: (hit: ExperienceSearchResult) => void;
}

export const SearchSuggestionItem = React.memo(function SearchSuggestionItem({
  hit,
  userLocation,
  onPress,
}: SearchSuggestionItemProps) {
  const {t} = useTranslation('map');
  const emoji = TYPE_EMOJI[hit.type] ?? '\uD83D\uDCCD';
  const typeLabel = t(`filterLabels.${hit.type}`, {defaultValue: hit.type});
  const imageUrl = hit.heroImage?.url ? resolveMediaUrl(hit.heroImage.url) : null;
  const cityName = hit.location?.city;
  const coords = hit.location?.coordinates;
  const distance = userLocation && coords
    ? haversineDistanceMeters(
        userLocation.latitude,
        userLocation.longitude,
        coords.latitude,
        coords.longitude,
      )
    : null;

  return (
    <TouchableOpacity
      onPress={() => onPress(hit)}
      activeOpacity={0.7}
      style={styles.suggestionItem}>
      {/* Thumbnail */}
      <View style={styles.suggestionThumb}>
        {imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.suggestionThumbImg} />
        ) : (
          <View style={[styles.suggestionThumbImg, styles.suggestionThumbPlaceholder]}>
            <Text style={styles.suggestionThumbEmoji}>{emoji}</Text>
          </View>
        )}
      </View>

      {/* Text content */}
      <Box flex={1} gap="xs">
        <Text
          fontFamily={fonts.bold}
          numberOfLines={1}
          style={styles.suggestionTitle}>
          {hit.title}
        </Text>
        <Box flexDirection="row" alignItems="center" gap="xs">
          <Text style={styles.suggestionTypeBadge}>
            {emoji} {typeLabel}
          </Text>
          {cityName && (
            <Text numberOfLines={1} style={styles.suggestionCity}>
              · {cityName}
            </Text>
          )}
        </Box>
      </Box>

      {/* Distance */}
      {distance != null && (
        <Text style={styles.suggestionDistance}>
          {formatDistance(distance)}
        </Text>
      )}
    </TouchableOpacity>
  );
});
