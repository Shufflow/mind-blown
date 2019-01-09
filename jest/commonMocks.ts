import MockFirebase from 'mock-cloud-firestore';
import React from 'react';
import { View } from 'react-native';

jest.mock('react-native-firebase', () => new MockFirebase());
jest.mock('react-native-google-signin', () => {
  const GoogleSigninButton = () => React.createElement<any>(View);
  GoogleSigninButton.Size = { Wide: 0 };

  return { GoogleSigninButton };
});
