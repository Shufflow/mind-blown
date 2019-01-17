import { AsyncStorage } from 'react-native';
import RNLanguages from 'react-native-languages';
import i18n from 'i18n-js';

export * from './strings';
import en from './en';
import ptBR from './ptBR';

i18n.locale = RNLanguages.language;
i18n.fallbacks = true;
i18n.translations = {
  en,
  'pt-BR': ptBR,
};

interface Locale {
  [key: string]: string;
}

export const Locales = Object.entries(i18n.translations).reduce(
  (res: Locale, [key, value]: [string, any]) => ({
    ...res,
    [key]: value.name,
  }),
  {} as Locale,
);

const LOCALE_KEY = 'LOCALE_KEY';
export const setLocale = async (locale: string): Promise<void> => {
  i18n.locale = locale;
  await AsyncStorage.setItem(LOCALE_KEY, locale);
};

export const setupLocale = async (): Promise<string> => {
  const locale = await AsyncStorage.getItem(LOCALE_KEY);
  if (locale) {
    i18n.locale = locale;
  }

  return i18n.locale;
};

const t = (key: any, ...args: any[]): string => i18n.t(key, ...args);
export default t;
