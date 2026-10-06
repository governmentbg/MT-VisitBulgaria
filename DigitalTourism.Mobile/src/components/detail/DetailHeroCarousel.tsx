import React, {useState, useRef, useCallback} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Box, Icon, Image, ResizeMode} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH;

interface DetailHeroCarouselProps {
  images: string[];
}

export const DetailHeroCarousel = React.memo(function DetailHeroCarousel({
  images,
}: DetailHeroCarouselProps) {
  const {t} = useTranslation('common');
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onScroll = useCallback(
    (e: {nativeEvent: {contentOffset: {x: number}}}) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setActiveIndex(index);
    },
    [],
  );

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <FlatList
          ref={listRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyExtractor={(_, i) => String(i)}
          renderItem={({item, index}) => (
            <Image
              source={{uri: item}}
              style={styles.heroImage}
              resizeMode={ResizeMode.cover}
              accessibilityLabel={t('a11y.imageOf', {current: index + 1, total: images.length})}
            />
          )}
        />
      ) : (
        <Box
          style={styles.heroImage}
          backgroundColor="surfaceBackground"
          alignItems="center"
          justifyContent="center">
          <Icon source="image-off-outline" size={48} color="textSecondary" />
        </Box>
      )}

      {images.length > 1 && (
        <Box
          position="absolute"
          bottom={16}
          left={0}
          right={0}
          flexDirection="row"
          justifyContent="center"
          gap="s">
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
              accessibilityLabel={t('a11y.carouselDot', {index: i + 1})}
            />
          ))}
        </Box>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  dotActive: {
    backgroundColor: palette.green500,
  },
  dotInactive: {
    backgroundColor: palette.gray100,
  },
});
