/**
 * I18nProvider
 *
 * Initializes i18next and provides context for language management.
 * Must be placed after AppThemeProvider but before other providers
 * that depend on localized content.
 */

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { i18n } from '../i18n';
import { setApiLanguage } from '../services/api/apiClient';

interface I18nContextValue {
  language: string;
  changeLanguage: (lng: string) => Promise<void>;
  supportedLanguages: string[];
  isReady: boolean;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    // Initialize i18n
    const initI18n = async () => {
      try {
        // i18n is already initialized in i18n.ts
        // Just wait for it to be ready
        if (!i18n.isInitialized) {
          await i18n.init();
        }
        
        setLanguage(i18n.language);
        setIsReady(true);
        
        // Set initial API language
        setApiLanguage(i18n.language);
        
      } catch (error) {
        console.error('[I18nProvider] Failed to initialize:', error);
        // Set ready anyway with fallback language
        setLanguage('en');
        setIsReady(true);
      }
    };

    initI18n();

    // Listen to language changes
    const handleLanguageChanged = (lng: string) => {
      setLanguage(lng);
      // Update API language whenever i18n language changes
      setApiLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error('[I18nProvider] Failed to change language:', error);
      throw error;
    }
  };

  const contextValue: I18nContextValue = {
    language,
    changeLanguage,
    supportedLanguages: ['en', 'bg', 'de', 'ru', 'fr'],
    isReady,
  };

  // Show loading spinner while i18n initializes
  if (!isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <I18nContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </I18nContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
