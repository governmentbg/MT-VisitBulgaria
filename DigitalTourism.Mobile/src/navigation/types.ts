import type {NavigatorScreenParams} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

/**
 * Onboarding Stack Navigator param list
 */
export type OnboardingStackParamList = {
  Welcome: undefined;
  Carousel: undefined;
};

/**
 * Root Stack Navigator param list
 */
export type RootStackParamList = {
  AnimatedSplash: undefined;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
  Search: undefined;
  EventDetail: {id: string};
  AttractionDetail: {id: string};
  HotelDetail: {id: string};
  RestaurantDetail: {id: string};
  ActivityDetail: {id: string};
  Settings: undefined;
  Profile: undefined;
  EditProfile: undefined;
  RouteDetail: {id: number};
  CreateRoute:
    | {
        routeId?: number;
        name?: string;
        startDate?: string;
        duration?: number;
      }
    | undefined;
};

/**
 * Bottom Tab Navigator param list
 */
export type TabParamList = {
  Explore: undefined;
  Events: undefined;
  Routes: undefined;
  Favourites: undefined;
};

/**
 * Screen props types for type-safe navigation
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  T
>;

export type OnboardingStackScreenProps<
  T extends keyof OnboardingStackParamList,
> = NativeStackScreenProps<OnboardingStackParamList, T>;

/**
 * Declare global types for navigation
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
