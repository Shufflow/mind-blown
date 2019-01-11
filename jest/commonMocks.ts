import MockFirebase from 'mock-cloud-firestore';
import React from 'react';
import { View, NativeModules as RNNativeModules } from 'react-native';

jest.mock('firebase', () => new MockFirebase());
jest.mock('react-native-google-signin', () => {
  const GoogleSigninButton = () => React.createElement<any>(View);
  GoogleSigninButton.Size = { Wide: 0 };

  return { GoogleSigninButton };
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
