import React from 'react';
import {StyleSheet} from 'react-native';
import {Box, Text, Image, ResizeMode} from '../../../design';
import {fonts} from '../../../theme/fonts';
import type {ImageProps} from '../../../design';

type ImageSource = NonNullable<ImageProps['source']>;

interface CityPinCardProps {
  image: ImageSource;
  name: string;
  rotation?: number;
}

export function CityPinCard({image, name, rotation = 0}: CityPinCardProps) {
  return (
    <Box
      alignItems="center"
      style={rotation !== 0 ? {transform: [{rotate: `${rotation}deg`}]} : undefined}>
      <Box
        width={128}
        height={112}
        borderTopLeftRadius="xl"
        borderTopRightRadius="xl"
        overflow="hidden"
        borderWidth={4}
        borderBottomWidth={0}
        borderColor="mainBackground"
        backgroundColor="mainBackground">
        <Image
          source={image}
          style={styles.image}
          resizeMode={ResizeMode.cover}
        />
      </Box>
      <Box
        backgroundColor="mainBackground"
        borderBottomLeftRadius="xl"
        borderBottomRightRadius="xl"
        paddingHorizontal="s"
        paddingVertical="xs"
        alignItems="center"
        justifyContent="center"
        width={128}
        style={styles.labelContainer}>
        <Text
          variant="caption"
          fontFamily={fonts.bold}
          color="textPrimary"
          textAlign="center"
          numberOfLines={1}>
          {name}
        </Text>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  labelContainer: {
    shadowColor: '#0A0D12',
    shadowOffset: {width: 0, height: 16},
    shadowOpacity: 0.14,
    shadowRadius: 32,
    elevation: 8,
  },
});
