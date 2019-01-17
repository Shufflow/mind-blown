import { AsyncStorage, NativeModules, Platform } from 'react-native';
import i18n from 'i18n-js';

const LOCALE_KEY = 'LOCALE_KEY';

export const Locales: { [key: string]: string } = {
  en: 'English',
  'pt-BR': 'Português',
};

export const getLocale = async (): Promise<string> => {
  const locale = await AsyncStorage.getItem(LOCALE_KEY);
  return (
    locale ||
    Platform.select({
      android: () => NativeModules.I18nManager.localeIdentifier,
      ios: () => NativeModules.SettingsManager.settings.AppleLanguages[0],
    })()
  );
};

export const setLocale = async (locale: string): Promise<void> => {
  i18n.locale = locale;
  await AsyncStorage.setItem(LOCALE_KEY, locale);
};

export default getLocale;
