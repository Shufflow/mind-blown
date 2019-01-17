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

const t = (key: any, ...args: any[]): string => i18n.t(key, ...args);
export default t;
