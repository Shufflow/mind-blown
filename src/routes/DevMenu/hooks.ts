import { useCallback } from 'react';
import { useDidMount, useWorker, useWorkerState } from 'react-hook-utilities';
import { GoogleSignin } from '@react-native-community/google-signin';

import RouteName from '@routes';
import { AdsConsumerProps } from '@hocs/withAds';

import Analytics from 'src/models/analytics';
import googleLogin from 'src/models/auth';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';
import IAP from 'src/models/iap';

export const useSignIn = () => {
  const {
    callback: checkSignIn,
    data: isSignedIn,
    error: errorCheck,
    isLoading: isLoadingCheck,
  } = useWorkerState(async () => GoogleSignin.isSignedIn(), [], false);

  const {
    callback: handlePressSignIn,
    error: errorSignIn,
    isLoading: isLoadingSignIn,
  } = useWorker(async () => {
    await googleLogin();
    await checkSignIn();
  }, []);

  const {
    callback: handlePressLogout,
    error: errorLogout,
    isLoading: isLoadingLogout,
  } = useWorker(async () => {
    await GoogleSignin.signOut();
    await checkSignIn();
  }, []);

  return {
    handlePressLogout,
    handlePressSignIn,
    isSignedIn,
    error: errorCheck || errorSignIn || errorLogout,
    isLoading: isLoadingCheck || isLoadingSignIn || isLoadingLogout,
  };
};

export type Props = ColoredScreenProps & AdsConsumerProps;
const hook = ({ navigation, checkIsAdFree }: Props) => {
  const {
    error,
    handlePressLogout,
    handlePressSignIn,
    isSignedIn,
    isLoading,
  } = useSignIn();

  useDidMount(() => {
    Analytics.currentScreen(RouteName.DevMenu);
  });

  const handlePressModeratePhrases = useCallback(() => {
    const { color } = navigation;
    navigation.navigate(RouteName.ModeratePhrases, color);
  }, [navigation.color, navigation.navigate]);

  const { callback: handleToggleAdFree } = useWorker(
    async (value: boolean) => {
      IAP.forceAdFree = !value;
      await checkIsAdFree();
    },
    [checkIsAdFree],
  );

  const handlePressCrash = useCallback(() => {
    throw new Error('forced crash');
  }, []);

  const handlePressModerateSuggestions = useCallback(() => {
    navigation.navigate(RouteName.ModerateSuggestions);
  }, [navigation.navigate]);

  return {
    error,
    handlePressCrash,
    handlePressLogout,
    handlePressModeratePhrases,
    handlePressModerateSuggestions,
    handlePressSignIn,
    handleToggleAdFree,
    isLoading,
    isSignedIn,
  };
};

export type HookedProps = ReturnType<typeof hook>;
export default hook;
