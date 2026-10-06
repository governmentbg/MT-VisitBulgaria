import React, {useRef, useState, useCallback} from 'react';
import {View, StyleSheet, Pressable as RNPressable} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Box, Text, SafeAreaView} from '../../design';
import {useTheme} from '@shopify/restyle';
import type {Theme} from '../../theme';
import type {RootStackParamList} from '../../navigation/types';
import {useOnboarding} from '../../hooks/useOnboarding';
import {CarouselPage} from './components/CarouselPage';
import {DotIndicator} from './components/DotIndicator';
import {fonts} from '../../theme/fonts';
import {theme as themeConfig} from '../../theme';
import {ExploreIllustration} from './components/ExploreIllustration';
import {EventsIllustration} from './components/EventsIllustration';
import {JourneyIllustration} from './components/JourneyIllustration';

const TOTAL_PAGES = 3;

interface PageConfig {
  titleKey: string;
  descriptionKey: string;
  renderIllustration: (isActive: boolean) => React.ReactNode;
}

const PAGES: PageConfig[] = [
  {
    titleKey: 'carousel.page1.title',
    descriptionKey: 'carousel.page1.description',
    renderIllustration: (isActive: boolean) => (
      <ExploreIllustration isActive={isActive} />
    ),
  },
  {
    titleKey: 'carousel.page2.title',
    descriptionKey: 'carousel.page2.description',
    renderIllustration: (isActive: boolean) => (
      <EventsIllustration isActive={isActive} />
    ),
  },
  {
    titleKey: 'carousel.page3.title',
    descriptionKey: 'carousel.page3.description',
    renderIllustration: (isActive: boolean) => (
      <JourneyIllustration isActive={isActive} />
    ),
  },
];

export function CarouselScreen() {
  const {t} = useTranslation('onboarding');
  const {completeOnboarding} = useOnboarding();
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme<Theme>();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const isLastPage = currentPage === TOTAL_PAGES - 1;

  const finishOnboarding = useCallback(() => {
    completeOnboarding();
    rootNavigation.replace('Main', {screen: 'Explore'});
  }, [completeOnboarding, rootNavigation]);

  const handleNext = useCallback(() => {
    if (isLastPage) {
      finishOnboarding();
    } else {
      pagerRef.current?.setPage(currentPage + 1);
    }
  }, [currentPage, isLastPage, finishOnboarding]);

  const handleSkip = useCallback(() => {
    finishOnboarding();
  }, [finishOnboarding]);

  return (
    <SafeAreaView flex={1} backgroundColor="mainBackground">
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={e => setCurrentPage(e.nativeEvent.position)}>
        {PAGES.map((page, index) => (
          <View key={index}>
            <CarouselPage
              title={t(page.titleKey)}
              description={t(page.descriptionKey)}
              isActive={currentPage === index}
              renderIllustration={page.renderIllustration}
            />
          </View>
        ))}
      </PagerView>

      {/* Bottom controls */}
      <Box paddingHorizontal="m" paddingBottom="l" gap="l">
        <DotIndicator currentPage={currentPage} totalPages={TOTAL_PAGES} />

        {isLastPage ? (
          /* Last page: single full-width Start Exploring button */
          <RNPressable
            onPress={handleNext}
            style={[
              styles.button,
              {backgroundColor: theme.colors.accentGreenDark},
            ]}>
            <Text
              variant="button"
              fontFamily={fonts.bold}
              color="textOnPrimary"
              textAlign="center">
              {t('carousel.startExploring')}
            </Text>
          </RNPressable>
        ) : (
          /* Other pages: Skip + Next buttons */
          <Box flexDirection="row" gap="s">
            <Box flex={1}>
              <RNPressable
                onPress={handleSkip}
                style={[
                  styles.button,
                  {backgroundColor: theme.colors.accentGreenLight},
                ]}>
                <Text
                  variant="button"
                  fontFamily={fonts.bold}
                  style={{color: theme.colors.accentGreenDarker}}
                  textAlign="center">
                  {t('carousel.skip')}
                </Text>
              </RNPressable>
            </Box>

            <Box flex={1}>
              <RNPressable
                onPress={handleNext}
                style={[
                  styles.button,
                  {backgroundColor: theme.colors.accentGreenDark},
                ]}>
                <Text
                  variant="button"
                  fontFamily={fonts.bold}
                  color="textOnPrimary"
                  textAlign="center">
                  {t('carousel.next')}
                </Text>
              </RNPressable>
            </Box>
          </Box>
        )}
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
  button: {
    height: 48,
    borderRadius: themeConfig.borderRadii.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
