import React from 'react';
import {ScrollView} from 'react-native';
import {SafeAreaView, Box, Text} from '../../design';
import {moderateScale} from '../../theme/scaling';

const SCROLL_BOTTOM_PADDING = moderateScale(120);
import {DetailHeroCarousel} from './DetailHeroCarousel';
import {DetailOverlayButtons} from './DetailOverlayButtons';
import {DetailBottomCTAs} from './DetailBottomCTAs';
import {DetailSkeleton} from './DetailSkeleton';
import {useTranslation} from 'react-i18next';

interface DetailLayoutProps {
  images: string[];
  isLoading: boolean;
  isError?: boolean;
  notFound: boolean;
  notFoundTitle: string;
  notFoundMessage: string;
  errorTitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onBack: () => void;
  onHeart?: () => void;
  onShare?: () => void;
  isFavourited?: boolean;
  primaryCta: {label: string; onPress: () => void};
  secondaryCta?: {label: string; onPress: () => void};
  children: React.ReactNode;
}

export const DetailLayout = React.memo(function DetailLayout({
  images,
  isLoading,
  isError,
  notFound,
  notFoundTitle,
  notFoundMessage,
  errorTitle,
  errorMessage,
  onRetry,
  onBack,
  onHeart,
  onShare,
  isFavourited,
  primaryCta,
  secondaryCta,
  children,
}: DetailLayoutProps) {
  const {t} = useTranslation('common');
  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError) {
    return (
      <SafeAreaView flex={1}>
        <Box flex={1} justifyContent="center" alignItems="center" padding="xl">
          <Text variant="title" textAlign="center" marginBottom="m">
            {errorTitle || notFoundTitle}
          </Text>
          <Text variant="body" color="textSecondary" textAlign="center">
            {errorMessage || notFoundMessage}
          </Text>
          {onRetry && (
            <Box marginTop="l">
              <Text variant="button" color="primary" onPress={onRetry}>
                {'\u21BB'} {t('buttons.retry')}
              </Text>
            </Box>
          )}
        </Box>
      </SafeAreaView>
    );
  }

  if (notFound) {
    return (
      <SafeAreaView flex={1}>
        <Box flex={1} justifyContent="center" alignItems="center" padding="xl">
          <Text variant="title" textAlign="center" marginBottom="m">
            {notFoundTitle}
          </Text>
          <Text variant="body" color="textSecondary" textAlign="center">
            {notFoundMessage}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: SCROLL_BOTTOM_PADDING}}>
        <DetailHeroCarousel images={images} />

        <Box paddingHorizontal="m" paddingTop="m">
          {children}
        </Box>
      </ScrollView>

      {/* Fixed overlay — outside ScrollView so it stays on screen and receives touches */}
      <DetailOverlayButtons onBack={onBack} onHeart={onHeart} onShare={onShare} isFavourited={isFavourited} />

      <DetailBottomCTAs
        primaryLabel={primaryCta.label}
        primaryOnPress={primaryCta.onPress}
        secondaryLabel={secondaryCta?.label}
        secondaryOnPress={secondaryCta?.onPress}
      />
    </Box>
  );
});
