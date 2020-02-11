import { useCallback } from 'react';
import { useDidMount } from 'react-hook-utilities';

import RouteName from '@routes';
import { useLocale, LocaleConsumerProps } from '@hocs/withLocale';

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
  const { setLocale, ...locales } = useLocale();

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
    (locale: string) => {
      setLocale(locale);
      navigation.setParams({ updateLocale: '' });
      Analytics.selectLanguage(locale);
    },
    [setLocale, navigation],
  );

  return {
    ...locales,
    canBuyDiscount,
    handleBuyAdFree,
    handleNavigate,
    handleSetLocale,
    isAdFree,
    isIAPAvailable,
  };
};

export type HookedProps = ReturnType<typeof useSettings> &
  LocaleConsumerProps &
  ColoredScreenProps;
export default useSettings;
