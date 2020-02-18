import { useCallback } from 'react';
import { useDidMount, useEffectUpdate } from 'react-hook-utilities';
import messaging from '@react-native-firebase/messaging';

import RouteName from '@routes';
import { useLocale, LocaleConsumerProps } from '@hocs/withLocale';
import { sanitizeLocale } from '@utils/locales';

import Analytics from 'src/models/analytics';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';

import { useAdsSettings } from './ads';
export * from './usePushNotifications';

const useSettings = ({ navigation }: ColoredScreenProps) => {
  const {
    isAdFree,
    handleBuyAdFree,
    isIAPAvailable,
    canBuyDiscount,
  } = useAdsSettings();
  const { setLocale, locale } = useLocale();

  useDidMount(() => {
    Analytics.currentScreen(RouteName.Settings);
  });

  const handleNavigate = useCallback(
    (routeName: RouteName) => () => {
      navigation.navigate(routeName, navigation.color);
    },
    [navigation],
  );

  const handleSetLocale = useCallback(
    (newLocale: string) => {
      setLocale(newLocale);
      navigation.setParams({ updateLocale: '' });
      Analytics.selectLanguage(newLocale);
    },
    [setLocale, navigation],
  );

  useEffectUpdate(
    ([oldLocale]) => {
      if (messaging().isRegisteredForRemoteNotifications) {
        Promise.all([
          messaging().subscribeToTopic(sanitizeLocale(locale)),
          oldLocale
            ? messaging().unsubscribeFromTopic(sanitizeLocale(oldLocale ?? ''))
            : Promise.resolve(),
        ]);
      }
    },
    [locale],
  );

  return {
    canBuyDiscount,
    handleBuyAdFree,
    handleNavigate,
    handleSetLocale,
    isAdFree,
    isIAPAvailable,
    locale,
  };
};

export type HookedProps = ReturnType<typeof useSettings> &
  LocaleConsumerProps &
  ColoredScreenProps;
export default useSettings;
