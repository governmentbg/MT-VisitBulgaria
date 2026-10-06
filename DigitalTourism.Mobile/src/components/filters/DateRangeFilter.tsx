import React, {useState, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, TextInput, Platform} from 'react-native';
import {Box, Text, Icon} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {fonts} from '../../theme/fonts';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';

interface DateRangeFilterProps {
  dateFrom?: number;
  dateTo?: number;
  onChange: (dateFrom?: number, dateTo?: number) => void;
}

/**
 * Format a timestamp to a user-friendly short date string.
 */
function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Parse a date string in YYYY-MM-DD format to a timestamp.
 * Returns undefined if the string is not a valid date.
 */
function parseDateInput(text: string): number | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return undefined;
  const date = new Date(text + 'T00:00:00');
  if (isNaN(date.getTime())) return undefined;
  return date.getTime();
}

/**
 * Format a timestamp to YYYY-MM-DD for the text input.
 */
function toInputFormat(timestamp?: number): string {
  if (timestamp == null) return '';
  const d = new Date(timestamp);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Date range filter component.
 * Uses simple text inputs in YYYY-MM-DD format since @react-native-community/datetimepicker
 * is not installed. Displays formatted dates when values are set.
 */
export function DateRangeFilter({dateFrom, dateTo, onChange}: DateRangeFilterProps) {
  const {t} = useTranslation('common');
  const [editingFrom, setEditingFrom] = useState(false);
  const [editingTo, setEditingTo] = useState(false);
  const [fromText, setFromText] = useState(toInputFormat(dateFrom));
  const [toText, setToText] = useState(toInputFormat(dateTo));

  const handleFromSubmit = useCallback(() => {
    setEditingFrom(false);
    const parsed = parseDateInput(fromText);
    if (parsed !== undefined) {
      onChange(parsed, dateTo);
    } else if (fromText === '') {
      onChange(undefined, dateTo);
    }
  }, [fromText, dateTo, onChange]);

  const handleToSubmit = useCallback(() => {
    setEditingTo(false);
    const parsed = parseDateInput(toText);
    if (parsed !== undefined) {
      onChange(dateFrom, parsed);
    } else if (toText === '') {
      onChange(dateFrom, undefined);
    }
  }, [toText, dateFrom, onChange]);

  const handleClear = useCallback(() => {
    setFromText('');
    setToText('');
    setEditingFrom(false);
    setEditingTo(false);
    onChange(undefined, undefined);
  }, [onChange]);

  const hasSelection = dateFrom != null || dateTo != null;

  return (
    <Box>
      <Box flexDirection="row" alignItems="center" gap="s">
        {/* From date */}
        <TouchableOpacity
          onPress={() => {
            setFromText(toInputFormat(dateFrom));
            setEditingFrom(true);
          }}
          activeOpacity={0.7}
          style={[styles.dateButton, dateFrom != null && styles.dateButtonActive]}>
          <Icon
            source="calendar-outline"
            size={moderateScale(16)}
            color={dateFrom != null ? palette.green700 : palette.gray600}
          />
          {editingFrom ? (
            <TextInput
              style={[styles.dateInput, dateFrom != null && styles.dateTextActive]}
              value={fromText}
              onChangeText={setFromText}
              onBlur={handleFromSubmit}
              onSubmitEditing={handleFromSubmit}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={palette.gray400}
              autoFocus
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              returnKeyType="done"
              maxLength={10}
            />
          ) : (
            <Text style={[styles.dateText, dateFrom != null && styles.dateTextActive]}>
              {dateFrom != null
                ? formatDate(dateFrom)
                : t('dateRange.from', {defaultValue: 'From'})}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.separator}>{'\u2014'}</Text>

        {/* To date */}
        <TouchableOpacity
          onPress={() => {
            setToText(toInputFormat(dateTo));
            setEditingTo(true);
          }}
          activeOpacity={0.7}
          style={[styles.dateButton, dateTo != null && styles.dateButtonActive]}>
          <Icon
            source="calendar-outline"
            size={moderateScale(16)}
            color={dateTo != null ? palette.green700 : palette.gray600}
          />
          {editingTo ? (
            <TextInput
              style={[styles.dateInput, dateTo != null && styles.dateTextActive]}
              value={toText}
              onChangeText={setToText}
              onBlur={handleToSubmit}
              onSubmitEditing={handleToSubmit}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={palette.gray400}
              autoFocus
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              returnKeyType="done"
              maxLength={10}
            />
          ) : (
            <Text style={[styles.dateText, dateTo != null && styles.dateTextActive]}>
              {dateTo != null
                ? formatDate(dateTo)
                : t('dateRange.to', {defaultValue: 'To'})}
            </Text>
          )}
        </TouchableOpacity>

        {/* Clear button */}
        {hasSelection && (
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
            <Icon
              source="close-circle"
              size={moderateScale(20)}
              color={palette.gray600}
            />
          </TouchableOpacity>
        )}
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    backgroundColor: palette.gray50,
    borderRadius: 100,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderWidth: 1,
    borderColor: palette.gray100,
  },
  dateButtonActive: {
    backgroundColor: '#E6F8F6',
    borderColor: palette.green500,
  },
  dateText: {
    fontSize: moderateScale(13),
    fontFamily: fonts.regular,
    color: palette.gray600,
  },
  dateTextActive: {
    color: palette.green700,
    fontFamily: fonts.bold,
  },
  dateInput: {
    flex: 1,
    fontSize: moderateScale(13),
    fontFamily: fonts.regular,
    color: palette.black,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  separator: {
    fontSize: moderateScale(14),
    fontFamily: fonts.regular,
    color: palette.gray600,
  },
});
