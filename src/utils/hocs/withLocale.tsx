import React from 'react';
import { getLocale, setLocale as asyncSetLocale } from 'src/models/locale';

interface ProviderState {
  locale: string;
}

export interface LocaleConsumerProps extends ProviderState {
  setLocale: (locale: string) => void;
}

const { Provider, Consumer } = React.createContext<LocaleConsumerProps>({
  locale: '',
  setLocale: () => {},
});

export const withLocaleProvider = <T extends Object>(
  WrappedComponent: React.ComponentType<T>,
): React.ComponentClass<T> => {
  class LocaleProvider extends React.Component<T, ProviderState> {
    state = { locale: '' };

    async componentDidMount() {
      const locale = await getLocale();
      this.setLocale(locale);
    }

    setLocale = async (locale: string) => {
      this.setState({ locale });
      await asyncSetLocale(locale);
    };

    render() {
      const { locale } = this.state;
      return (
        <Provider value={{ locale, setLocale: this.setLocale }}>
          <WrappedComponent {...this.props} />
        </Provider>
      );
    }
  }

  return LocaleProvider;
};

export const withLocale = <T extends Object>(
  WrappedComponent: React.ComponentType<T>,
): React.ComponentType<T & LocaleConsumerProps> => (
  props: T,
): React.ReactElement<T> => (
  <Consumer>
    {({ locale, setLocale }) => (
      <WrappedComponent locale={locale} setLocale={setLocale} {...props} />
    )}
  </Consumer>
);
