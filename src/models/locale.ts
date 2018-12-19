import { NativeModules, Platform } from 'react-native';

const locale = Platform.select({
  android: NativeModules.I18nManager.localeIdentifier,
  ios: NativeModules.SettingsManager.settings.AppleLanguages[0],
});

export default locale;
