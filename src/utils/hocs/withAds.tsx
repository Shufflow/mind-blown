import React from 'react';

import IAP from 'src/models/iap';

interface ProviderState {
  showAds: boolean;
}

export interface AdsConsumerProps extends ProviderState {
  checkIsAdFree: () => Promise<boolean>;
}

const { Provider, Consumer } = React.createContext<AdsConsumerProps>({
  checkIsAdFree: async () => Promise.resolve(false),
  showAds: !__DEV__,
});

export const withAdsProvider = <Props extends Object>(
  WrappedComponent: React.ComponentType<Props>,
): React.ComponentClass<Props> => {
  class ShowAdsProvider extends React.Component<Props, ProviderState> {
    state = { showAds: !__DEV__ };

    componentDidMount() {
      this.checkIsAdFree();
    }

    checkIsAdFree = async () => {
      const isAdFree = await IAP.isAdFree();
      this.setState({ showAds: !isAdFree });

      return isAdFree;
    };

    render() {
      const { showAds } = this.state;
      return (
        <Provider
          value={{
            showAds,
            checkIsAdFree: this.checkIsAdFree,
          }}
        >
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
  <Consumer>{args => <WrappedComponent {...args} {...props} />}</Consumer>
);
