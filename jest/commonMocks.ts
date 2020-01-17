import MockFirebase from 'mock-cloud-firestore';
import React from 'react';
import { View, NativeModules as RNNativeModules } from 'react-native';

jest.mock('firebase', () => new MockFirebase());
jest.mock('react-native-google-signin', () => {
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
  buyProduct: Promise.resolve,
  finishTransaction: jest.fn(),
  getAvailablePurchases: async () => Promise.resolve([]),
  getProducts: async () => Promise.resolve([]),
  initConnection: Promise.resolve,
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
