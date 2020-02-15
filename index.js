import { AppRegistry, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import 'babel-polyfill';

import App from 'src/App';
import { name as appName } from './src/app.json';
import 'react-native-gesture-handler';

messaging().setBackgroundMessageHandler(async ({ data }) => {
  const { url } = data ?? {};
  if (!!url) {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
