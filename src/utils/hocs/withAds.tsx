import React from 'react';
import { AsyncStorage } from 'react-native';

const SHOW_ADS_KEY = 'SHOW_ADS_KEY';

interface ProviderState {
  showAds: boolean;
}

export interface AdsConsumerProps extends ProviderState {
  setShowAds: (value: boolean) => void;
}

const { Provider, Consumer } = React.createContext<AdsConsumerProps>({
  setShowAds: () => {},
  showAds: !__DEV__,
});

export const withAdsProvider = <Props extends Object>(
  WrappedComponent: React.ComponentType<Props>,
): React.ComponentClass<Props> => {
  class ShowAdsProvider extends React.Component<Props, ProviderState> {
    state = { showAds: !__DEV__ };

    async componentDidMount() {
      const showAds = await AsyncStorage.getItem(SHOW_ADS_KEY);
      this.setState({
        showAds: showAds !== 'false',
      });
    }

    setShowAds = async (showAds: boolean) => {
      this.setState({ showAds });
      await AsyncStorage.setItem(SHOW_ADS_KEY, showAds.toString());
    };

    render() {
      const { showAds } = this.state;
      return (
        <Provider value={{ showAds, setShowAds: this.setShowAds }}>
          <WrappedComponent {...this.props} />
        </Provider>
      );
    }
  }

  return ShowAdsProvider;
};

export const withAds = <Props extends Object>(
  WrappedComponent: React.ComponentType<Props>,
): React.ComponentType<Props & AdsConsumerProps> => (
  props: Props,
): React.ReactElement<Props> => (
  <Consumer>
    {({ setShowAds, showAds }) => (
      <WrappedComponent
        setShowAds={setShowAds}
        showAds={!__DEV__ || showAds}
        {...props}
      />
    )}
  </Consumer>
);
