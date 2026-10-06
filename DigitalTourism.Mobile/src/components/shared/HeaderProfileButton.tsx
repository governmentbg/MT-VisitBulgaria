import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import UserIcon from '../../../assets/icons/user.svg';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import type {RootStackParamList} from '../../navigation/types';
import {useAuth} from '../../contexts/AuthContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const HeaderProfileButton: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const {t} = useTranslation('navigation');
  const {user} = useAuth();
  const avatarUri = user?.picture?.startsWith('https://') ? user.picture : undefined;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Profile')}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={t('tabs.profile')}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      style={styles.touch}>
      {avatarUri ? (
        <Image source={{uri: avatarUri}} style={styles.avatar} />
      ) : (
        <View style={styles.button}>
          <UserIcon
            width={moderateScale(13)}
            height={moderateScale(15)}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touch: {
    width: moderateScale(44),
    height: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: 100,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.gray900,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    shadowColor: palette.gray900,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
});
