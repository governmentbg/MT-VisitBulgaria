import React from 'react';
import { ScrollView, SafeAreaView } from '../../design';
import { LanguageSelector } from './components/LanguageSelector';

/**
 * Settings screen with language selection
 */
export function SettingsScreen() {

  return (
    <SafeAreaView flex={1} paddingVertical={'l'}>
      <ScrollView flexGrow={1}>
        <LanguageSelector />
      </ScrollView>
    </SafeAreaView>
  );
}
 