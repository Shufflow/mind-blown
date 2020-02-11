import React, { useContext } from 'react';
import i18n from 'i18n-js';

import { setLocale as asyncSetLocale } from '@locales';

interface ProviderState {
  locale: string;
}

export interface LocaleProviderProps {
  setLocale: (locale: string) => void;
}

export interface LocaleConsumerProps
  extends ProviderState,
    LocaleProviderProps {}

const LocaleContext = React.createContext<LocaleConsumerProps>({
  locale: '',
  setLocale: () => {},
});

export const withLocaleProvider = <T extends Object>(
  WrappedComponent: React.ComponentType<T>,
): React.ComponentClass<T> => {
  class LocaleProvider extends React.Component<T, ProviderState> {
    state = { locale: i18n.locale };

    setLocale = async (locale: string) => {
      this.setState({ locale });
      await asyncSetLocale(locale);
    };

    render() {
      const { locale } = this.state;
      return (
        <LocaleContext.Provider value={{ locale, setLocale: this.setLocale }}>
          <WrappedComponent setLocale={this.setLocale} {...this.props} />
        </LocaleContext.Provider>
      );
    }
  }

  return LocaleProvider;
};

export const useLocale = () => useContext(LocaleContext);
