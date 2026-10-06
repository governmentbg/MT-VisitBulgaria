import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Gb, Bg, De, Ru, Fr} from 'react-native-svg-circle-country-flags';
import {Box, Text, Pressable, Icon, Modal} from '../../../design';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';
import type {Theme} from '../../../theme';
import {palette} from '../../../theme/palette';
import {fonts} from '../../../theme/fonts';

interface Language {
  code: string;
  nativeName: string;
  Flag: React.FC<{width: number; height: number}>;
}

const LANGUAGES: Language[] = [
  {code: 'en', nativeName: 'English', Flag: Gb},
  {code: 'bg', nativeName: '\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438', Flag: Bg},
  {code: 'de', nativeName: 'Deutsch', Flag: De},
  {code: 'ru', nativeName: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439', Flag: Ru},
  {code: 'fr', nativeName: 'Fran\u00e7ais', Flag: Fr},
];

function FlagAvatar({
  Flag,
  size,
}: {
  Flag: React.FC<{width: number; height: number}>;
  size: number;
}) {
  return (
    <View style={[styles.flagContainer, {width: size, height: size, borderRadius: size / 2}]}>
      <Flag width={size} height={size} />
    </View>
  );
}

interface OnboardingLanguageSelectorProps {
  compact?: boolean;
}

export function OnboardingLanguageSelector({compact = false}: OnboardingLanguageSelectorProps) {
  const {i18n, t} = useTranslation('onboarding');
  const theme = useTheme<Theme>();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingLanguage, setLoadingLanguage] = useState<string | null>(null);

  const currentLanguage =
    LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = async (code: string) => {
    if (code === i18n.language) {
      setIsOpen(false);
      return;
    }
    setLoadingLanguage(code);
    try {
      await i18n.changeLanguage(code);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setLoadingLanguage(null);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      {compact ? (
        <Pressable
          onPress={() => setIsOpen(true)}
          style={styles.compactTrigger}>
          <FlagAvatar Flag={currentLanguage.Flag} size={30} />
        </Pressable>
      ) : (
        <Pressable
          onPress={() => setIsOpen(true)}
          style={[
            styles.trigger,
            {
              backgroundColor: theme.colors.surfaceBackground,
              borderColor: theme.colors.border,
            },
          ]}>
          <Box flexDirection="row" alignItems="center">
            <FlagAvatar Flag={currentLanguage.Flag} size={28} />
            <Text variant="body" marginLeft="s" flex={1}>
              {currentLanguage.nativeName}
            </Text>
            <Icon source="chevron-down" size={20} color="textSecondary" />
          </Box>
        </Pressable>
      )}

      {/* Language sheet */}
      <Modal visible={isOpen} onClose={() => setIsOpen(false)}>
        {/* Title */}
        <Box padding="m" alignItems="center">
          <Text
            variant="bodyMedium"
            fontFamily={fonts.bold}
            textAlign="center">
            {t('welcome.selectLanguage')}
          </Text>
        </Box>

        {/* Language list */}
        {LANGUAGES.map(language => {
          const isSelected = i18n.language === language.code;
          const isLoading = loadingLanguage === language.code;

          return (
            <React.Fragment key={language.code}>
              {/* Divider */}
              <Box height={1} backgroundColor="divider" />

              {/* Language row */}
              <Pressable
                onPress={() => handleLanguageChange(language.code)}
                disabled={isLoading}
                style={[
                  styles.languageRow,
                  isSelected && {
                    backgroundColor: theme.colors.accentGreenLight,
                  },
                ]}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  paddingHorizontal="m"
                  flex={1}>
                  <FlagAvatar Flag={language.Flag} size={40} />
                  <Text variant="body" marginLeft="m" flex={1}>
                    {language.nativeName}
                  </Text>
                  {isLoading && (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.accentGreen}
                    />
                  )}
                </Box>
              </Pressable>
            </React.Fragment>
          );
        })}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  compactTrigger: {
    backgroundColor: palette.white,
    borderRadius: 48,
    padding: 6,
    shadowColor: '#141414',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  flagContainer: {
    borderWidth: 1,
    borderColor: palette.gray400,
    overflow: 'hidden',
  },
  languageRow: {
    height: 64,
    justifyContent: 'center',
  },
});
