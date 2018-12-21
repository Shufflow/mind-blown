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

/**
 * Typescript has an error where it can't handle Partial with generic types.
 * This is a workaround to make `locale` and `setLocale` optional, so Typescript doesn't complain
 * about components using components wrapped by `withLocale`
 */
interface PrivateConsumer {
  locale?: string;
  setLocale?: (locale: string) => void;
}

export const withLocale = <T extends Object>(
  WrappedComponent: React.ComponentType<T>,
): React.ComponentClass<any> => {
  // tslint:disable-next-line:max-classes-per-file
  class LocaleConsumer extends React.PureComponent<T & PrivateConsumer> {
    render() {
      return (
        <Consumer>
          {({ locale, setLocale }) => (
            <WrappedComponent
              locale={locale}
              setLocale={setLocale}
              {...this.props}
            />
          )}
        </Consumer>
      );
    }
  }

  return LocaleConsumer;
};
