import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Box, Text, Icon, Pressable} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';
import type {TFunction} from 'i18next';
import {TYPE_EMOJI} from '../../constants';
import type {FacetValue} from '../../services/api/types/searchTypes';
import {useFacetConfig} from '../../hooks/queries/useFacetConfig';
import {useBottomSheetBackdrop} from '../../hooks/useBottomSheetBackdrop';
import {styles} from './MapListFiltersModal.styles';

interface FilterSection {
  /** Key into `MapListFilters` — drives state mutations */
  key: keyof MapListFilters;
  /** i18n label key */
  labelKey: string;
  /** Admin-configured UI hints */
  defaultExpanded: boolean;
  /** `undefined` = no truncation. `null` from the wire is coerced here. */
  maxVisible?: number;
  selectionMode: 'multi' | 'single';
  options: Array<{id: string; name: string; count?: number; emoji?: string}>;
}

export interface MapListFilters {
  type: string[];
  categories: string[];
  cities: string[];
  municipality: string[];
  region: string[];
  starRating: string[];
  amenities: string[];
  cuisineType: string[];
  dietaryOptions: string[];
  difficultyLevel: string[];
  seasonality: string[];
  tags: string[];
  organizer: string[];
}

export const emptyMapListFilters: MapListFilters = {
  type: [],
  categories: [],
  cities: [],
  municipality: [],
  region: [],
  starRating: [],
  amenities: [],
  cuisineType: [],
  dietaryOptions: [],
  difficultyLevel: [],
  seasonality: [],
  tags: [],
  organizer: [],
};

/**
 * Per-facet UI binding — mobile-side presentation concerns only:
 *   - `stateKey`  : which field of `MapListFilters` stores the selection
 *   - `labelKey`  : i18n key for the section title
 *   - `format`    : optional (value → display) formatter (stars, emoji, …)
 *   - `sortFn`    : optional value sort override (e.g. starRating descending)
 *
 * The Typesense field name (`tsField`) is NOT duplicated here — it comes
 * from `facetConfig` on the server, which is the single source of truth
 * for the facet-key-to-field mapping.
 *
 * Keyed by the admin's `facetKey`. Anything not in this map is silently
 * skipped — either unsupported or not wired into the mobile filter state.
 */
const FACET_BINDINGS: Record<
  string,
  {
    stateKey: keyof MapListFilters;
    labelKey: string;
    format?: (value: string, t: TFunction) => {name: string; emoji?: string};
    sortFn?: (a: FacetValue, b: FacetValue) => number;
  }
> = {
  type: {
    stateKey: 'type',
    labelKey: 'listFilters.type',
    format: (value, t) => ({
      name: t(`filterLabels.${value}`, {defaultValue: value}),
      emoji: TYPE_EMOJI[value],
    }),
  },
  categories: {stateKey: 'categories', labelKey: 'listFilters.categories'},
  tags: {stateKey: 'tags', labelKey: 'listFilters.tags'},
  city: {stateKey: 'cities', labelKey: 'listFilters.city'},
  municipality: {stateKey: 'municipality', labelKey: 'listFilters.municipality'},
  region: {stateKey: 'region', labelKey: 'listFilters.region'},
  starRating: {
    stateKey: 'starRating',
    labelKey: 'listFilters.starRating',
    sortFn: (a, b) => Number(b.value) - Number(a.value),
    format: (value) => ({name: '⭐'.repeat(Number(value))}),
  },
  amenities: {stateKey: 'amenities', labelKey: 'listFilters.amenities'},
  cuisineType: {stateKey: 'cuisineType', labelKey: 'listFilters.cuisineType'},
  dietaryOptions: {stateKey: 'dietaryOptions', labelKey: 'listFilters.dietaryOptions'},
  difficultyLevel: {stateKey: 'difficultyLevel', labelKey: 'listFilters.difficultyLevel'},
  seasonality: {stateKey: 'seasonality', labelKey: 'listFilters.seasonality'},
  organizer: {stateKey: 'organizer', labelKey: 'listFilters.organizer'},
};

interface MapListFiltersModalProps {
  visible: boolean;
  onClose: () => void;
  filters: MapListFilters;
  onFiltersChange: (filters: MapListFilters) => void;
  /** Facet counts keyed by server field name (e.g. `city.name` → counts). */
  facets?: Record<string, FacetValue[]>;
}

/**
 * Filter bottom sheet for the map/events list.
 *
 * Facet sections are driven entirely by the admin-configured
 * `facetConfig` (fetched via `useFacetConfig`) — no hardcoded list. The
 * admin decides what's enabled, in what order, with what default
 * expansion, max visible options, and single/multi selection. AND/OR
 * filter mode is handled server-side; the client only reports picked
 * values back via `MapListFilters`.
 */
export function MapListFiltersModal({
  visible,
  onClose,
  filters,
  onFiltersChange,
  facets = {},
}: MapListFiltersModalProps) {
  const {t} = useTranslation('map');
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['75%'], []);

  const {data: facetConfig} = useFacetConfig();

  /** Expanded-section state, seeded from admin `defaultExpanded`. */
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  /** Which sections have "Show all" toggled on (overriding `maxVisible`). */
  const [showAllSections, setShowAllSections] = useState<Set<string>>(new Set());
  /**
   * Seeded once per mount. Admin `defaultExpanded` changes won't re-apply
   * until the next app launch — intentional, so a background refetch
   * doesn't wipe the user's expand/collapse interactions mid-use.
   */
  const [configSeeded, setConfigSeeded] = useState(false);

  // Seed expandedSections once the admin config arrives.
  useEffect(() => {
    if (configSeeded || !facetConfig) return;
    const defaults = new Set<string>();
    for (const item of facetConfig) {
      if (item.enabled && item.defaultExpanded) {
        const binding = FACET_BINDINGS[item.facetKey];
        if (binding) defaults.add(binding.stateKey);
      }
    }
    setExpandedSections(defaults);
    setConfigSeeded(true);
  }, [facetConfig, configSeeded]);

  const filterSections = useMemo((): FilterSection[] => {
    if (!facetConfig) return [];
    const sorted = [...facetConfig].sort((a, b) => a.sortOrder - b.sortOrder);
    const sections: FilterSection[] = [];

    for (const cfg of sorted) {
      if (!cfg.enabled) continue;
      const binding = FACET_BINDINGS[cfg.facetKey];
      if (!binding) continue;

      // `tsField` comes from the server config — single source of truth.
      const counts = facets[cfg.tsField];
      if (!counts || counts.length === 0) continue;

      const ordered = binding.sortFn ? [...counts].sort(binding.sortFn) : counts;

      sections.push({
        key: binding.stateKey,
        labelKey: binding.labelKey,
        defaultExpanded: cfg.defaultExpanded,
        // Server sends `null` for "no limit" (C# nullable int → JSON null).
        // Normalize to `undefined` here so the render-side truncation check
        // can stay simple (`typeof maxVisible === 'number'`).
        maxVisible: typeof cfg.maxVisible === 'number' ? cfg.maxVisible : undefined,
        selectionMode: cfg.selectionMode,
        options: ordered.map(c => {
          const formatted = binding.format?.(c.value, t);
          return {
            id: c.value,
            name: formatted?.name ?? c.value,
            count: c.count,
            emoji: formatted?.emoji,
          };
        }),
      });
    }

    return sections;
  }, [facetConfig, facets, t]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
  }, [filters]);

  const handleClear = useCallback(() => {
    onFiltersChange(emptyMapListFilters);
  }, [onFiltersChange]);

  const toggleSection = useCallback((key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleShowAll = useCallback((key: string) => {
    setShowAllSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleFilterOption = useCallback(
    (sectionKey: keyof MapListFilters, optionId: string, selectionMode: 'multi' | 'single') => {
      const current = filters[sectionKey] || [];
      let updated: string[];
      if (selectionMode === 'single') {
        // Radio behaviour: tapping the current value clears it, otherwise replace.
        updated = current.includes(optionId) ? [] : [optionId];
      } else {
        updated = current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
      }
      onFiltersChange({...filters, [sectionKey]: updated});
    },
    [filters, onFiltersChange],
  );

  const renderBackdrop = useBottomSheetBackdrop();

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}>
      <BottomSheetScrollView style={styles.content}>
        {/* Header */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="m"
          marginBottom="l">
          <Box flexDirection="row" alignItems="center" gap="s">
            <Text style={styles.title}>{t('filters')}</Text>
            {activeFilterCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </Box>
          {activeFilterCount > 0 && (
            <Pressable onPress={handleClear}>
              <Text style={styles.clearButton}>{t('clear')}</Text>
            </Pressable>
          )}
        </Box>

        {/* Sections */}
        <View style={styles.scrollContent}>
          {filterSections.map(section => {
            const isExpanded = expandedSections.has(section.key);
            const sectionFilters = filters[section.key] || [];
            const sectionFilterCount = sectionFilters.length;

            const showAll = showAllSections.has(section.key);
            // Strict numeric check — `null`/`undefined` both mean "no limit",
            // and `section.options.slice(0, null)` would return an empty
            // array (null → 0) which previously hid real options.
            const maxVisible = section.maxVisible;
            const hasLimit = typeof maxVisible === 'number' && maxVisible > 0;
            const shouldTruncate = hasLimit && section.options.length > maxVisible;
            const visibleOptions = shouldTruncate && !showAll
              ? section.options.slice(0, maxVisible)
              : section.options;
            const hiddenCount = shouldTruncate
              ? section.options.length - maxVisible
              : 0;

            return (
              <Box key={section.key} style={styles.section}>
                <TouchableOpacity
                  onPress={() => toggleSection(section.key)}
                  activeOpacity={0.7}
                  style={styles.sectionHeader}>
                  <Box flexDirection="row" alignItems="center" gap="s">
                    <Text style={styles.sectionTitle}>
                      {t(section.labelKey)}
                    </Text>
                    {sectionFilterCount > 0 && (
                      <View style={styles.sectionBadge}>
                        <Text style={styles.sectionBadgeText}>
                          {sectionFilterCount}
                        </Text>
                      </View>
                    )}
                  </Box>
                  <Icon
                    source={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={moderateScale(24)}
                    color={palette.black}
                  />
                </TouchableOpacity>

                {isExpanded && visibleOptions.length > 0 && (
                  <Box marginTop="m" gap="s">
                    {visibleOptions.map(option => {
                      const isSelected = sectionFilters.includes(option.id);
                      return (
                        <TouchableOpacity
                          key={option.id}
                          onPress={() =>
                            toggleFilterOption(section.key, option.id, section.selectionMode)
                          }
                          activeOpacity={0.7}
                          style={styles.checkboxRow}>
                          <Box flexDirection="row" alignItems="center" gap="m">
                            <View
                              style={[
                                styles.checkbox,
                                section.selectionMode === 'single' && styles.checkboxRadio,
                                isSelected && styles.checkboxSelected,
                              ]}>
                              {isSelected && (
                                <Icon
                                  source={
                                    section.selectionMode === 'single'
                                      ? 'circle-medium'
                                      : 'check'
                                  }
                                  size={moderateScale(15)}
                                  color={palette.white}
                                />
                              )}
                            </View>
                            <Text style={styles.checkboxLabel}>
                              {option.emoji ? `${option.emoji} ` : ''}
                              {option.name}
                            </Text>
                          </Box>
                          {option.count !== undefined && (
                            <Text style={styles.checkboxCount}>
                              {option.count}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}

                    {shouldTruncate && (
                      <TouchableOpacity
                        onPress={() => toggleShowAll(section.key)}
                        activeOpacity={0.7}>
                        <Text style={styles.showMoreText}>
                          {showAll
                            ? t('showLess', {defaultValue: 'Show less'})
                            : t('showMore', {
                                count: hiddenCount,
                                defaultValue: 'Show {{count}} more',
                              })}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
