import React, { useState, useCallback, useMemo, useContext } from 'react';
import { useDidMount } from 'react-hook-utilities';

import IAP from 'src/models/iap';

interface ProviderState {
  showAds: boolean;
}

export interface AdsConsumerProps extends ProviderState {
  checkIsAdFree: () => Promise<boolean>;
}

const AdsContext = React.createContext<AdsConsumerProps>({
  checkIsAdFree: async () => Promise.resolve(true),
  showAds: !__DEV__,
});

export const withAdsProvider = <Props extends Object>(
  WrappedComponent: React.ComponentType<Props>,
): React.FunctionComponent<Props> => (props: Props) => {
  const [showAds, setShowAds] = useState(!__DEV__);

  const checkIsAdFree = useCallback(async () => {
    const isAdFree = await IAP.refreshAdFree();
    setShowAds(!isAdFree);

    return isAdFree;
  }, []);

  useDidMount(() => {
    checkIsAdFree();
  });

  const value = useMemo(() => ({ checkIsAdFree, showAds }), [
    checkIsAdFree,
    showAds,
  ]);

  return (
    <AdsContext.Provider value={value}>
      <WrappedComponent {...props} />
    </AdsContext.Provider>
  );
};

export const withAds = <Props extends Object>(
  WrappedComponent: React.ComponentType<Props>,
): React.ComponentType<Minus<Props, AdsConsumerProps>> => (
  props: Minus<Props, AdsConsumerProps>,
) => (
  <AdsContext.Consumer>
    {args => <WrappedComponent {...args} {...(props as Props)} />}
  </AdsContext.Consumer>
);

export const useAds = () => useContext(AdsContext);
