import MockFirebase from 'mock-cloud-firestore';
import React from 'react';
import { View, NativeModules as RNNativeModules } from 'react-native';

jest.mock('firebase', () => new MockFirebase());
jest.mock('@react-native-community/google-signin', () => {
  const GoogleSigninButton = () => React.createElement<any>(View);
  GoogleSigninButton.Size = { Wide: 0 };

  return {
    GoogleSigninButton,
    GoogleSignin: {
      configure: jest.fn(),
      signInSilently: jest.fn().mockResolvedValue(undefined),
    },
  };
});
jest.mock('react-native-push-notification', () => ({
  checkPermissions: jest.fn(),
  configure: jest.fn(),
  requestPermissions: jest.fn(),
}));
jest.mock('@react-native-firebase/admob', () => {
  const AdMobBanner = () => React.createElement<any>(View);
  AdMobBanner.simulatorId = '';

  return {
    AdMobBanner,
    AdEventType: {
      ERROR: 'ERROR',
      LOADED: 'LOADED',
    },
    AdsConsent: {
      addTestDevices: jest.fn(),
    },
    InterstitialAd: {
      createForAdRequest: jest.fn(() => ({
        load: jest.fn(),
        onAdEvent: jest.fn(),
        show: Promise.resolve,
      })),
    },
    RewardedAd: {
      createForAdRequest: jest.fn(() => ({
        load: jest.fn(),
        onAdEvent: jest.fn(),
        show: Promise.resolve,
      })),
    },
    RewardedAdEventType: {
      EARNED_REWARD: 'EARNED_REWARD',
      LOADED: 'LOADED',
    },
    TestIds: {
      BANNER: 'BANNER',
      INTERSTITIAL: 'INTERSTITIAL',
      REWARDED: 'REWARDED',
    },
  };
});
jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true,
  default: () => ({ logEvent: jest.fn() }),
}));
jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: () => ({
    hasPermission: jest.fn(),
    isRegisteredForRemoteNotifications: jest.fn(),
    registerForRemoteNotifications: jest.fn(),
    requestPermission: jest.fn(),
    unregisterForRemoteNotifications: jest.fn(),
  }),
}));
jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
  show: jest.fn(),
}));
jest.mock('react-native-code-push', () => {
  const fn: any = () => (a: any) => a;
  fn.CheckFrequency = {};
  fn.InstallMode = {};
  return fn;
});
jest.mock('react-native-languages', () => ({
  locale: 'en',
}));
jest.mock('react-native-iap', () => ({
  finishTransaction: jest.fn(),
  getAvailablePurchases: jest.fn().mockResolvedValue([]),
  getProducts: jest.fn().mockResolvedValue([]),
  initConnection: jest.fn().mockResolvedValue('true'),
  requestPurchase: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('react-native-text-size', () => ({
  measure: jest.fn(),
}));
jest.mock('react-native-share', () => ({
  open: jest.fn(),
}));
jest.mock('@react-native-community/async-storage', () => {
  const storage: Record<string, any> = {};
  return {
    getItem: jest.fn(key => storage[key]),
    setItem: jest.fn((key, value) => {
      storage[key] = value;
    }),
  };
});

RNNativeModules.UIManager = RNNativeModules.UIManager || {};
RNNativeModules.UIManager.RCTView = RNNativeModules.UIManager.RCTView || {};
RNNativeModules.RNGestureHandlerModule = RNNativeModules.RNGestureHandlerModule || {
  State: { BEGAN: 'BEGAN', FAILED: 'FAILED', ACTIVE: 'ACTIVE', END: 'END' },
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
};
RNNativeModules.PlatformConstants = RNNativeModules.PlatformConstants || {
  forceTouchAvailable: false,
};
RNNativeModules.Fonts = {
  getAvailableFonts: jest.fn().mockResolvedValue(['a']),
};
