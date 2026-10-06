import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Box, Text, Pressable, Icon} from '../../../design';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../../theme';
import {i18nStorage} from '../../../i18n/languageDetector';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isBundled: boolean;
}

const LANGUAGES: Language[] = [
  {code: 'en', name: 'English', nativeName: 'English', flag: '\ud83c\uddec\ud83c\udde7', isBundled: true},
  {code: 'bg', name: 'Bulgarian', nativeName: '\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438', flag: '\ud83c\udde7\ud83c\uddec', isBundled: true},
  {code: 'de', name: 'German', nativeName: 'Deutsch', flag: '\ud83c\udde9\ud83c\uddea', isBundled: true},
  {code: 'ru', name: 'Russian', nativeName: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439', flag: '\ud83c\uddf7\ud83c\uddfa', isBundled: true},
  {code: 'fr', name: 'French', nativeName: 'Fran\u00e7ais', flag: '\ud83c\uddeb\ud83c\uddf7', isBundled: true},
];

/**
 * Language selector component for switching between supported languages
 */
export function LanguageSelector() {
  const {i18n, t} = useTranslation('common');
  const theme = useTheme<Theme>();
  const [loadingLanguage, setLoadingLanguage] = useState<string | null>(null);

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === i18n.language) {
      return;
    }

    setLoadingLanguage(languageCode);
    try {
      await i18n.changeLanguage(languageCode);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setLoadingLanguage(null);
    }
  };

  // Check if a language has been downloaded (has loaded resources in i18n store or MMKV cache)
  const isLanguageDownloaded = (languageCode: string): boolean => {
    if (LANGUAGES.find(l => l.code === languageCode)?.isBundled) {
      return true;
    }
    
    // Check if the language has any loaded namespaces in the i18n store
    const store = i18n.store?.data?.[languageCode];
    if (store && Object.keys(store).length > 0) {
      return true;
    }
    
    // For backend-loaded languages, check MMKV cache directly
    // This handles the case where translations are cached but not currently in the i18n store
    const namespacesToCheck = ['common', 'navigation', 'events', 'attractions', 'lists'];
    const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    for (const namespace of namespacesToCheck) {
      const cacheKey = `i18n_cache_${languageCode}_${namespace}`;
      const cached = i18nStorage.getString(cacheKey);
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          // Check if cache is valid and not expired
          if (parsed.data && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            return true; // Found valid cached translation
          }
        } catch (error) {
          // Invalid JSON, continue checking other namespaces
          continue;
        }
      }
    }
    
    return false;
  };

  return (
    <Box>
      <Text variant="subtitle" marginBottom="m" paddingHorizontal="m">
        {t('language.selectLanguage')}
      </Text>
      
      {LANGUAGES.map(language => {
        const isSelected = i18n.language === language.code;
        const isLoading = loadingLanguage === language.code;
        const isDownloaded = isLanguageDownloaded(language.code);
        const needsDownload = !language.isBundled && !isDownloaded && !isSelected;

        return (
          <Pressable
            key={language.code}
            onPress={() => handleLanguageChange(language.code)}
            disabled={isLoading}
            style={[
              styles.languageItem,
              {
                backgroundColor: isSelected
                  ? theme.colors.surfaceBackground
                  : theme.colors.mainBackground,
                borderColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.border,
              },
            ]}>
            <Box flexDirection="row" alignItems="center" flex={1}>
              <Text style={styles.flag}>{language.flag}</Text>
              <Box flex={1} marginLeft="m">
                <Text variant="body" fontWeight={isSelected ? 'bold' : 'normal'}>
                  {language.nativeName}
                </Text>
                <Text variant="small" color="textSecondary">
                  {language.name}
                </Text>
              </Box>
              
              {isLoading && (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              )}
              
              {!isLoading && needsDownload && (
                <Box flexDirection="row" alignItems="center">
                  <Icon source="download" size={16} color="textSecondary" />
                  <Text variant="small" color="textSecondary" marginLeft="xs">
                    {t('language.download')}
                  </Text>
                </Box>
              )}
              
              {isSelected && !isLoading && (
                <Icon source="check-circle" size={24} color="success" />
              )}
            </Box>
          </Pressable>
        );
      })}

      <Box marginTop="m" paddingHorizontal="m">
        <Text variant="small" color="textSecondary">
          {t('language.downloadInfo')}
        </Text>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  flag: {
    fontSize: 32,
  },
});
